import os
# CRITICAL: Must be set BEFORE importing tensorflow
# Avoid Metal/GPU hangs and OpenMP conflicts on Mac
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import time
import pandas as pd
import numpy as np
import tensorflow as tf
import sys
from pathlib import Path
import joblib

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))
from data.loader import EnergyDataLoader

# Constants
SEQ_LENGTH = 168
FEATURE_COLS = ['consumption_kWh', 'sin_hour', 'cos_hour', 
                'sin_day', 'cos_day', 'sin_month', 'cos_month', 
                'is_weekend', 'is_holiday', 'is_semester', 'is_exam']
MODELS_DIR = Path("models")
DATA_PATH = Path("data/processed/synthetic_2022_2026.csv")

def create_sequences_vectorized(data, seq_length):
    try:
        from numpy.lib.stride_tricks import sliding_window_view
        # sliding_window_view on axis 0 makes the window the last dimension: (N-W+1, Features, Window)
        windows = sliding_window_view(data, window_shape=seq_length, axis=0)
        # We need (Batch, Window, Features) -> Transpose (0, 2, 1)
        return windows.transpose(0, 2, 1)
    except ImportError:
        num_samples = len(data) - seq_length
        sub_shape = (num_samples, seq_length, data.shape[1])
        sub_strides = (data.strides[0], data.strides[0], data.strides[1])
        return np.lib.stride_tricks.as_strided(data, shape=sub_shape, strides=sub_strides)

def load_models(building_name):
    print(f"Loading models for {building_name}...")
    models = {}
    gru_path = MODELS_DIR / f"{building_name}_gru.keras"
    ae_path = MODELS_DIR / f"{building_name}_autoencoder.keras"
    scaler_path = MODELS_DIR / f"{building_name}_scaler.pkl"
    
    start_load = time.time()
    if gru_path.exists():
        models['gru'] = tf.keras.models.load_model(gru_path, compile=False)
    if ae_path.exists():
        models['ae'] = tf.keras.models.load_model(ae_path, compile=False)
    if scaler_path.exists():
        models['scaler'] = joblib.load(scaler_path)
    print(f"Models loaded in {time.time() - start_load:.2f}s")
    return models

def benchmark(building_name="Edificio Apolonia"):
    if not DATA_PATH.exists():
        print("Data file not found!")
        return

    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Select Building
    df_build = df[df['building_name'] == building_name].sort_values('timestamp')
    if df_build.empty:
        print(f"No data for {building_name}")
        return

    # Load Models
    models = load_models(building_name)
    if 'gru' not in models or 'scaler' not in models:
        print("Models missing. Cannot benchmark.")
        return

    # Define a test range (1 month of data)
    start_date = "2024-03-01"
    end_date = "2024-04-01"
    
    print(f"TF Devices: {tf.config.list_physical_devices()}")
    
    print(f"\n--- Starting Benchmark for range: {start_date} to {end_date} ---")
    
    # --- START TIMER ---
    t0 = time.time()
    
    # 1. Slice
    start_dt = pd.to_datetime(start_date)
    end_dt = pd.to_datetime(end_date) + pd.Timedelta(days=1) - pd.Timedelta(seconds=1)
    # Context
    req_start = start_dt - pd.Timedelta(hours=SEQ_LENGTH)
    mask = (df_build['timestamp'] >= req_start) & (df_build['timestamp'] <= end_dt)
    df_window = df_build.loc[mask].copy()
    
    # 2. Preprocess
    df_window['hour'] = df_window['timestamp'].dt.hour
    df_window['day_of_week'] = df_window['timestamp'].dt.dayofweek
    df_window['month'] = df_window['timestamp'].dt.month
    df_window['sin_hour'] = np.sin(2 * np.pi * df_window['hour'] / 24)
    df_window['cos_hour'] = np.cos(2 * np.pi * df_window['hour'] / 24)
    
    # Ensure cols exist
    for col in FEATURE_COLS:
        if col not in df_window.columns:
            df_window[col] = 0
            
    raw_values = df_window[FEATURE_COLS].values
    
    # 3. Scale
    scaled_values = models['scaler'].transform(raw_values)
    
    # 4. Vectorize
    X_reshaped = create_sequences_vectorized(scaled_values[:-1], SEQ_LENGTH)
    
    # 5. Predict
    print(f"Input shape: {X_reshaped.shape}, Dtype: {X_reshaped.dtype}")
    # CRITICAL: Mac TF hangs on float64 sometimes. Explicit cast to float32.
    X_reshaped = X_reshaped.astype(np.float32)
    print(f"Casted to: {X_reshaped.dtype}")
    
    t_pred_start = time.time()
    
    try:
        with tf.device('/CPU:0'):
            print("Predicting GRU...")
            _ = models['gru'].predict(X_reshaped, verbose=0, batch_size=32)
            print("GRU Done.")
            
            if 'ae' in models:
                print("Predicting AE...")
                _ = models['ae'].predict(X_reshaped, verbose=0, batch_size=32)
                print("AE Done.")
    except Exception as e:
        print(f"Prediction Error: {e}")
        
    t_end = time.time()
    
    print(f"Total Inference Time: {t_end - t0:.4f} seconds")
    print(f"Prediction Only: {t_end - t_pred_start:.4f} seconds")
    print(f"Data Points Processed: {len(X_reshaped)}")
    
if __name__ == "__main__":
    benchmark()
