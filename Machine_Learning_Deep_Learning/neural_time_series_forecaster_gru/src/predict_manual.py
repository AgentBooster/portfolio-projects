import sys
import os
# CRITICAL: Must be set BEFORE importing tensorflow
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import argparse
import pandas as pd
import numpy as np
import tensorflow as tf
from pathlib import Path

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from data.loader import EnergyDataLoader

def get_prediction(building_name, target_date_str):
    """
    Core logic to get prediction and anomaly status.
    Returns a dictionary or None if error.
    """
    models_dir = Path("models")
    model_path = models_dir / f"{building_name}_gru.keras"
    scaler_path = models_dir / f"{building_name}_scaler.pkl"
    
    if not model_path.exists():
        print(f"Error: Model not found at {model_path}")
        return None

    # Load Data
    print("Loading data...")
    loader = EnergyDataLoader("data/processed/synthetic_2022_2026.csv", seq_length=168)
    print("Data loaded.")
    data, timestamps = loader.load_and_process(building_name)
    
    if scaler_path.exists():
        loader.load_scaler(scaler_path)
    else:
        print("Error: Scaler not found.")
        return None
        
    try:
        target_ts = pd.Timestamp(target_date_str)
        target_np = np.datetime64(target_ts)
    except Exception as e:
        print(f"Date error: {e}")
        return None
    
    indices = np.where(timestamps == target_np)[0]
    
    if len(indices) == 0:
        print(f"Error: Date {target_date_str} not found in dataset range.")
        return None
        
    idx = indices[0]
    
    if idx < loader.seq_length:
        print("Error: Not enough history.")
        return None
        
    input_seq = data[idx - loader.seq_length : idx]
    input_scaled = loader.scaler.transform(input_seq)
    input_reshaped = input_scaled.reshape(1, loader.seq_length, -1)
    
    # Load Forecast Model
    print("Loading Forecast Model...")
    model = tf.keras.models.load_model(model_path)
    
    # Cast to float32 to avoid Mac Metal hang
    input_reshaped = input_reshaped.astype(np.float32)
    
    print("Predicting Forecast...")
    with tf.device('/CPU:0'):
        # Bypass .predict() overhead to avoid potential hangs
        prediction_scaled = model(input_reshaped, training=False).numpy()
    print("Forecast Done.")
    
    dummy = np.zeros((1, loader.scaler.n_features_in_))
    dummy[:, 0] = prediction_scaled.flatten()
    prediction_kwh = loader.scaler.inverse_transform(dummy)[0, 0]
    actual_kwh = data[idx, 0]
    
    # Anomaly Check
    anomaly_model_path = models_dir / f"{building_name}_autoencoder.keras"
    threshold_path = models_dir / f"{building_name}_threshold.txt"
    
    mse = 0.0
    threshold = 0.0
    is_anomaly = False
    
    if anomaly_model_path.exists():
        print("Loading AE Model...")
        # Optimization: compile=False speeds up loading since we only need inference
        ae_model = tf.keras.models.load_model(anomaly_model_path, compile=False)
        print("Predicting Anomalies...")
        with tf.device('/CPU:0'):
            reconstruction = ae_model(input_reshaped, training=False).numpy()
        print("AE Done.")
        mse = np.mean(np.power(input_reshaped - reconstruction, 2))
        
        if threshold_path.exists():
            with open(threshold_path, 'r') as f:
                threshold = float(f.read())
                
        is_anomaly = mse > threshold

    return {
        "building": building_name,
        "timestamp": target_date_str,
        "predicted": float(prediction_kwh),
        "actual": float(actual_kwh),
        "difference": float(prediction_kwh - actual_kwh),
        "reconstruction_error": float(mse),
        "threshold": float(threshold),
        "is_anomaly": bool(is_anomaly)
    }

def predict_manual(building_name, target_date_str):
    result = get_prediction(building_name, target_date_str)
    if result:
        print(f"--- Manual Prediction for {building_name} @ {target_date_str} ---")
        print(f"\nPrediction for {target_date_str}:")
        print(f"Predicted Consumption: {result['predicted']:.2f} kWh")
        print(f"Actual Consumption:    {result['actual']:.2f} kWh")
        print(f"Difference:            {result['difference']:.2f} kWh")
        
        status = "ANOMALY DETECTED" if result['is_anomaly'] else "Normal"
        print(f"\nAnomaly Status: {status}")
        print(f"Reconstruction Error: {result['reconstruction_error']:.4f} (Threshold: {result['threshold']:.4f})")
        
        # --- Green Metric KPIs ---
        # 1. Cost (GC2 Tariff Logic)
        def get_price(ts):
            hour = ts.hour
            is_weekend = ts.dayofweek >= 5
            # Simplified Holiday List
            is_holiday = (ts.month, ts.day) in [(1,1), (1,6), (5,1), (7,18), (8,25), (11,2), (12,25)]
            
            if 0 <= hour < 7: return 2.433 # Valle
            if (18 <= hour < 22) and not is_weekend and not is_holiday: return 5.218 # Punta
            return 4.250 # Llano

        ts = pd.Timestamp(result['timestamp'])
        price = get_price(ts)
        waste = max(0, result['actual'] - result['predicted'])
        cost = waste * price
        
        # 2. CO2 (MIEM Factors)
        emission_factor = 0.056 if ts.year == 2023 else (0.006 if ts.year == 2024 else 0.056)
        co2 = waste * emission_factor
        
        print(f"\n--- 🌍 Green Metric Impact (Audit) ---")
        if waste > 0:
            print(f"⚠️  Waste Detected:      {waste:.2f} kWh")
            print(f"💰 Financial Waste:     ${cost:.2f} UYU (Tariff: ${price:.3f}/kWh)")
            print(f"🌫️  Carbon Footprint:    {co2:.4f} kg CO2")
        else:
            print(f"✅ Efficient Operation (No Waste Detected)")
            
        # 3. Normalized Metrics (Deep Dive)
        try:
            meta_path = Path("data/processed/buildings_metadata.csv")
            if meta_path.exists():
                meta = pd.read_csv(meta_path)
                area = meta.loc[meta['building_name'] == building_name, 'area_m2'].values[0]
                
                if area > 0:
                    intensity = result['actual'] / area
                    waste_intensity = waste / area
                    cost_m2 = cost / area
                    co2_m2 = co2 / area
                    
                    print(f"\n--- 📏 Deep Dive (Per m²) ---")
                    print(f"Building Area:       {area} m²")
                    print(f"Energy Intensity:    {intensity:.4f} kWh/m²")
                    if waste > 0:
                        print(f"Waste Intensity:     {waste_intensity:.4f} kWh/m²")
                        print(f"Waste Cost/m²:       ${cost_m2:.2f}/m²")
                        print(f"Waste CO2/m²:        {co2_m2:.4f} kg/m²")
        except Exception as e:
            # Silently fail if metadata issue, as this is optional context
            pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", type=str, required=True, help="Date string YYYY-MM-DD HH:MM")
    parser.add_argument("--building", type=str, required=True, help="Building Name")
    args = parser.parse_args()
    
    predict_manual(args.building, args.date)
