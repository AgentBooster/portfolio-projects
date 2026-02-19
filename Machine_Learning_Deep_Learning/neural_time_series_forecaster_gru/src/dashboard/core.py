import os
# CRITICAL ENV SHIELDING (Idempotent if already set by caller, vital if standalone)
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import pandas as pd
import numpy as np
import tensorflow as tf

# FORCE CPU for Core Logic
try:
    tf.config.set_visible_devices([], 'GPU')
    visible_devices = tf.config.get_visible_devices()
    print(f"DEBUG: Core TF Visible Devices: {visible_devices}")
except Exception as e:
    print(f"WARNING: Could not disable GPU: {e}")

import joblib
from pathlib import Path
import sys

# Paths
DATA_PATH = Path("data/processed/synthetic_2022_2026.csv")
METADATA_PATH = Path("data/processed/buildings_metadata.csv")
MODELS_DIR = Path("models")
LOGS_PATH = Path("data/processed/prediction_logs.csv")

SEQ_LENGTH = 168
FEATURE_COLS = ['consumption_kWh', 'sin_hour', 'cos_hour', 
                'sin_day', 'cos_day', 'sin_month', 'cos_month', 
                'is_weekend', 'is_holiday', 'is_semester', 'is_exam']



def load_data_core():
    """Loads and preprocesses the main dataset."""
    if not DATA_PATH.exists():
        return None, None, None
    
    df = pd.read_csv(DATA_PATH)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')
    
    if METADATA_PATH.exists():
        meta = pd.read_csv(METADATA_PATH)
    else:
        meta = pd.DataFrame()
        
    if LOGS_PATH.exists():
        logs = pd.read_csv(LOGS_PATH)
        logs['timestamp'] = pd.to_datetime(logs['timestamp'])
    else:
        logs = pd.DataFrame()
        
    return df, meta, logs

def load_models_core(building_name):
    """Loads models and scaler for a specific building."""
    # Paths
    gru_path = MODELS_DIR / f"{building_name}_gru.keras"
    ae_path = MODELS_DIR / f"{building_name}_autoencoder.keras"
    scaler_path = MODELS_DIR / f"{building_name}_scaler.pkl"
    thresh_path = MODELS_DIR / f"{building_name}_threshold.txt"
    
    models = {}
    
    if gru_path.exists():
        try:
            models['gru'] = tf.keras.models.load_model(gru_path, compile=False)
        except:
            pass
    if ae_path.exists():
        try:
            models['ae'] = tf.keras.models.load_model(ae_path, compile=False)
        except:
            pass
    if scaler_path.exists():
        models['scaler'] = joblib.load(scaler_path)
    if thresh_path.exists():
        with open(thresh_path, 'r') as f:
            models['threshold'] = float(f.read())
            
    return models

def preprocess_features(df_segment):
    """
    Applies the same feature engineering as loader.py
    Expects df_segment to have raw columns: timestamp, consumption_kWh, etc.
    """
    df = df_segment.copy()
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    
    df['sin_hour'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['cos_hour'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['sin_day'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['cos_day'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    df['sin_month'] = np.sin(2 * np.pi * df['month'] / 12)
    df['cos_month'] = np.cos(2 * np.pi * df['month'] / 12)
    
    return df[FEATURE_COLS].values

def create_sequences_vectorized(data, seq_length):
    """
    Creates sequences using numpy stride tricks for O(1) memory overhead and extreme speed.
    Expected data shape: (N, Features)
    Returns: (N - seq_length, seq_length, Features)
    """
    try:
        from numpy.lib.stride_tricks import sliding_window_view
        # sliding_window_view(data, window_shape, axis=0) returns shape (N-W+1, Features, Window)
        # We need (Batch, Window, Features) => Transpose (0, 2, 1)
        windows = sliding_window_view(data, window_shape=seq_length, axis=0)
        return windows.transpose(0, 2, 1)
    except ImportError:
        # Fallback for older numpy
        num_samples = len(data) - seq_length
        sub_shape = (num_samples, seq_length, data.shape[1])
        sub_strides = (data.strides[0], data.strides[0], data.strides[1])
        return np.lib.stride_tricks.as_strided(data, shape=sub_shape, strides=sub_strides)

# KPI Functions moved to dashboard.kpi_utils.py
# get_energy_price_vectorized -> REMOVED
# get_emission_factor_vectorized -> REMOVED

def run_inference_core(building_name, df_building, start_date, end_date, models):
    """
    Runs dynamic inference on the selected date range using vectorized operations.
    """
    # 1. Select Data + Context
    start_dt = pd.to_datetime(start_date)
    end_dt = pd.to_datetime(end_date) + pd.Timedelta(days=1) - pd.Timedelta(seconds=1)
    
    # We need context BEFORE the start date
    req_start = start_dt - pd.Timedelta(hours=SEQ_LENGTH)
    
    # Filter strictly
    mask = (df_building['timestamp'] >= req_start) & (df_building['timestamp'] <= end_dt)
    df_window = df_building.loc[mask].copy()
    
    if df_window.empty:
        print("DEBUG: df_window is empty.")
        return pd.DataFrame()

    print(f"DEBUG: Inference Range: {start_date} -> {end_date}")
    print(f"DEBUG: df_window shape: {df_window.shape}")

    # 2. Preprocess (Vectorized)
    raw_values = preprocess_features(df_window)
    timestamps = df_window['timestamp'].values
    
    # Check length
    if len(raw_values) <= SEQ_LENGTH:
        return pd.DataFrame() # Needs at least SEQ_LENGTH + 1 to predict 1 step
        
    # 3. Scale
    if 'scaler' not in models:
        return pd.DataFrame()
        
    scaled_values = models['scaler'].transform(raw_values)
    
    # 4. Create Sequences (Vectorized - FAST)
    X_reshaped = create_sequences_vectorized(scaled_values[:-1], SEQ_LENGTH) 
    
    if len(X_reshaped) == 0:
        return pd.DataFrame()

    # Targets
    target_timestamps = timestamps[SEQ_LENGTH:]
    actuals = raw_values[SEQ_LENGTH:, 0]
    
    # Ensure X length matches targets
    X_reshaped = X_reshaped[:len(target_timestamps)]
    
    # CRITICAL: Fix for Mac/Metal hang
    X_reshaped = np.ascontiguousarray(X_reshaped.astype(np.float32))
    
    # Log shape for production diagnosis
    print(f"DEBUG: X_reshaped shape (Input to Model): {X_reshaped.shape}")
    
    # 5. Predict (Batch)
    results = pd.DataFrame({
        'timestamp': target_timestamps,
        'actual_kWh': actuals
    })
    
    # Forecast GRU
    if 'gru' in models:
        # Use direct call instead of .predict() to avoid Metal overhead/trace
        with tf.device('/CPU:0'):
            pred_scaled = models['gru'](X_reshaped, training=False).numpy()
        
        # Inverse transform
        dummy = np.zeros((len(pred_scaled), len(FEATURE_COLS)))
        dummy[:, 0] = pred_scaled.flatten()
        pred_kwh = models['scaler'].inverse_transform(dummy)[:, 0]
        
        results['predicted_kWh'] = pred_kwh
        results['delta_kWh'] = results['actual_kWh'] - results['predicted_kWh']
        
    # Anomaly AE
    if 'ae' in models:
        with tf.device('/CPU:0'):
            reconstruction = models['ae'](X_reshaped, training=False).numpy()
        # Vectorized MSE
        mse = np.mean(np.power(X_reshaped - reconstruction, 2), axis=(1, 2))
        results['reconstruction_error'] = mse
        results['is_anomaly'] = mse > models.get('threshold', 9999)
        
    # Final Filter
    mask_final = (results['timestamp'] >= pd.Timestamp(start_date)) & (results['timestamp'] <= end_dt)
    return results.loc[mask_final]


# --- Future Forecasting Logic ---

def generate_future_features(start_dt, periods):
    """
    Generates feature columns for future dates without needing a CSV.
    Replicates logic from EnergyDataLoader.
    """
    future_dates = pd.date_range(start=start_dt, periods=periods, freq='H')
    df = pd.DataFrame({'timestamp': future_dates})
    
    # Feature Engineering (Replicated from loader.py)
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['month'] = df['timestamp'].dt.month
    
    df['sin_hour'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['cos_hour'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['sin_day'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['cos_day'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    df['sin_month'] = np.sin(2 * np.pi * df['month'] / 12)
    df['cos_month'] = np.cos(2 * np.pi * df['month'] / 12)
    
    # Is Weekend (Saturday=5, Sunday=6)
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Simple Heuristic for Holidays (New Year, Christmas, etc. - Expandable)
    # This acts as a placeholder or "Calendar Mock" for better realism than 0
    df['is_holiday'] = 0
    df.loc[(df['month'] == 1) & (df['timestamp'].dt.day == 1), 'is_holiday'] = 1 # Jan 1
    df.loc[(df['month'] == 12) & (df['timestamp'].dt.day == 25), 'is_holiday'] = 1 # Dec 25
    df.loc[(df['month'] == 5) & (df['timestamp'].dt.day == 1), 'is_holiday'] = 1 # May 1
    
    # Semester Heuristic (approximate academic calendar)
    # Semester 1: March-July, Semester 2: August-December
    is_sem1 = (df['month'] >= 3) & (df['month'] <= 7)
    is_sem2 = (df['month'] >= 8) & (df['month'] <= 12)
    df['is_semester'] = (is_sem1 | is_sem2).astype(int)
    
    # Exam Heuristic (July & December)
    df['is_exam'] = df['month'].isin([7, 12]).astype(int)
    
    # Dummy consumption for scaling compatibility (will be overwritten by predictions)
    df['consumption_kWh'] = 0.0
    
    # Reorder to match FEATURE_COLS exactly
    return df[FEATURE_COLS], df['timestamp']

def run_future_forecast(building_name, df_building, horizon_days, models):
    """
    Runs autoregressive future forecasting.
    1. Takes the LAST available sequence from df_building (real data).
    2. Generates future features for horizon_days.
    3. Recursively predicts next step and updates window.
    """
    if 'gru' not in models or 'scaler' not in models:
        return None, "Model or Scaler missing."
        
    # 1. Get Initial Window (Last SEQ_LENGTH points from real data)
    # df_building is expected to be sorted
    if len(df_building) < SEQ_LENGTH:
        return None, "Insufficient historical data for forecasting."
        
    last_window_df = df_building.iloc[-SEQ_LENGTH:].copy()
    last_timestamp = last_window_df['timestamp'].max()
    
    # Preprocess & Scale Initial Window
    raw_window = preprocess_features(last_window_df)
    current_window_scaled = models['scaler'].transform(raw_window) # (168, 11)
    
    # 2. Generate Future Features
    periods = horizon_days * 24
    start_future = last_timestamp + pd.Timedelta(hours=1)
    future_features_df, future_timestamps = generate_future_features(start_future, periods)
    
    # Scale future features (Consumption column is garbage 0 here)
    future_vals = future_features_df.values
    future_vals_scaled = models['scaler'].transform(future_vals)
    
    # 3. Autoregressive Loop
    
    # Convert to contiguous float32 for safety (CRITICAL for Mac/Metal stability)
    current_window_scaled = np.ascontiguousarray(current_window_scaled.astype(np.float32))
    # Cast future_vals_scaled once before loop
    future_vals_scaled = np.ascontiguousarray(future_vals_scaled.astype(np.float32))
    
    print(f"DEBUG: Starting Future Forecast for {building_name}, Horizon: {horizon_days} days. Dtype: {current_window_scaled.dtype}")
    
    for i in range(len(future_vals_scaled)):
        # A. Predict Next Step
        # Input: (1, 168, 11)
        input_tensor = current_window_scaled[np.newaxis, :, :]
        
        with tf.device('/CPU:0'):
            # GRU Output: (1, 1) -> scalar
            # We enforce float32 output
            pred_con_scaled = models['gru'](input_tensor, training=False).numpy()[0, 0]
            
        # B. Overwrite the dummy consumption in the future row with prediction
        future_vals_scaled[i, 0] = pred_con_scaled
        
        # C. Update Window (Slide)
        # Drop first row, append new row (which now has correct feature + predicted consumption)
        new_row = future_vals_scaled[i]
        
        # Vstack can promote types if not careful.
        # We explicitly cast again and ensure contiguity to be paranoid about stability.
        current_window_scaled = np.ascontiguousarray(
            np.vstack([current_window_scaled[1:], new_row]).astype(np.float32)
        )
        
    # 4. Inverse Transform
    # future_vals_scaled now contains the Predicted Consumption + Generated Features.
    real_values = models['scaler'].inverse_transform(future_vals_scaled)
    
    results = pd.DataFrame({
        'timestamp': future_timestamps,
        'predicted_kWh': real_values[:, 0] # Column 0 is consumption
    })
    
    return results, "Success"


def get_openai_response(api_key, context_str, user_prompt):
    """
    Generates a response from OpenAI (GPT-4o) based on context and user prompt.
    """
    from openai import OpenAI
    try:
        client = OpenAI(api_key=api_key)
        
        system_prompt = f"You are an expert Energy Consultant for a University Campus. Use the following context to answer the user's question briefly and professionally. Suggest actionable energy saving measures if anomalies are present. {context_str}"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating response: {e}"

def get_gemini_response(api_key, context_str, user_prompt):
    """
    Generates a response from Gemini based on context and user prompt.
    (Updated to use the new google-genai package)
    """
    from google import genai
    try:
        client = genai.Client(api_key=api_key)
        
        system_prompt = f"You are an expert Energy Consultant for a University Campus. Use the following context to answer the user's question briefly and professionally. Suggest actionable energy saving measures if anomalies are present. {context_str}"
        
        response = client.models.generate_content(
            model='gemini-2.0-flash', 
            contents=[system_prompt, user_prompt]
        )
        return response.text
    except Exception as e:
        return f"Error generating response: {e}"
