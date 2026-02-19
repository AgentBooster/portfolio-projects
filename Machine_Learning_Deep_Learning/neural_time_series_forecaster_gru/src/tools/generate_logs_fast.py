import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from pathlib import Path
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))
from data.loader import EnergyDataLoader

def generate_logs_fast():
    data_path = "data/processed/synthetic_2022_2026.csv"
    models_dir = Path("models")
    output_path = "data/processed/prediction_logs.csv"
    
    # Target just one building for verification
    target_building = "Edificio Central"
    
    print(f"Generating logs for {target_building}...")
    
    # Load Data
    loader = EnergyDataLoader(data_path, seq_length=168)
    data, timestamps = loader.load_and_process(target_building)
    
    # Last 1000 points
    limit = 1000
    subset_data = data[-limit:]
    subset_timestamps = timestamps[-limit:]
    
    # Load Scaler first to get input shape for model
    scaler_path = models_dir / f"{target_building}_scaler.pkl"
    if not scaler_path.exists():
        print("Scaler not found.")
        return
        
    scaler = joblib.load(scaler_path)
    loader.scaler = scaler
    subset_scaled = scaler.transform(subset_data)
    
    # Create Sequences
    X, y = loader.create_sequences(subset_scaled)
    
    # Load Model
    model_path = models_dir / f"{target_building}_gru.keras"
    if not model_path.exists():
        print("Model not found.")
        return
        
    model = tf.keras.models.load_model(model_path, compile=False)
    
    # Predict
    preds_scaled = model.predict(X, verbose=0)
    
    # Inverse
    def inverse_1d(arr_1d, scl):
        dummy = np.zeros((len(arr_1d), scl.n_features_in_))
        dummy[:, 0] = arr_1d.flatten()
        return scl.inverse_transform(dummy)[:, 0]
        
    y_actual = inverse_1d(y, scaler)
    y_pred = inverse_1d(preds_scaled, scaler)
    
    valid_timestamps = subset_timestamps[loader.seq_length:]
    
    df_log = pd.DataFrame({
        'timestamp': valid_timestamps,
        'building_name': target_building,
        'actual_kWh': y_actual,
        'predicted_kWh': y_pred
    })
    
    df_log['delta_kWh'] = df_log['actual_kWh'] - df_log['predicted_kWh']
    df_log['abs_error'] = df_log['delta_kWh'].abs()
    
    df_log.to_csv(output_path, index=False)
    print(f"Saved {len(df_log)} logs to {output_path}")

if __name__ == "__main__":
    generate_logs_fast()
