import sys
import os
import numpy as np
import tensorflow as tf
from pathlib import Path
import pandas as pd
import joblib

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))
from data.loader import EnergyDataLoader

def calibrate_thresholds(target_rate=0.05):
    print(f"--- CALIBRATING ANOMALY THRESHOLDS (Target Rate: {target_rate*100}%) ---")
    data_path = "data/processed/synthetic_2022_2026.csv"
    models_dir = Path("models")
    
    if not Path(data_path).exists():
        print("Data not found.")
        return

    # Load All Data Info
    df_all = pd.read_csv(data_path)
    buildings = df_all['building_name'].unique()
    
    normalization_factor = 1.0 - target_rate # e.g., 0.95 for 5% anomalies
    
    for b_name in buildings:
        print(f"\nCalibrating {b_name}...")
        
        # Paths
        anomaly_model_path = models_dir / f"{b_name}_autoencoder.keras"
        threshold_path = models_dir / f"{b_name}_threshold.txt"
        scaler_path = models_dir / f"{b_name}_scaler.pkl"
        
        if not anomaly_model_path.exists():
            print(f"Skipping {b_name} (No Anomaly Model)")
            continue
            
        # Get Data
        loader = EnergyDataLoader(data_path, seq_length=168)
        data, _ = loader.load_and_process(b_name, existing_df=df_all)
        
        # We start calibration on the FULL dataset or Test set?
        # Typically calibration is done on a Validation set or "Normal" historical data.
        # But here our "Test" data is the future 2025-2026.
        # If we calibrate on Test data, we are essentially saying "Accept 95% of this new behavior as normal".
        # Given the user's observation of 20-25% rate, this is exactly what we want: 
        # Adapt to the new "normal" of the synthetic future.
        
        # Let's use the Test split for calibration
        _, test_data = loader.split_train_test(data, train_ratio=0.8)
        
        # Load Scaler
        if scaler_path.exists():
            loader.load_scaler(scaler_path)
        else:
            loader.scale_data(data, data) # Fallback
            
        test_scaled = loader.scaler.transform(test_data)
        X_test, _ = loader.create_sequences(test_scaled)
        
        if len(X_test) == 0:
            continue
            
        # Predict
        try:
            model = tf.keras.models.load_model(anomaly_model_path, compile=False)
            reconstructions = model.predict(X_test, verbose=0)
            mse = np.mean(np.power(X_test - reconstructions, 2), axis=(1, 2))
            
            # Read Old Threshold
            old_threshold = 0.0
            if threshold_path.exists():
                with open(threshold_path, 'r') as f:
                    old_threshold = float(f.read())
            
            # Calculate New Threshold
            # We want only 'target_rate' of points to be above threshold.
            # So threshold = percentile(1 - target_rate)
            new_threshold = np.percentile(mse, normalization_factor * 100)
            
            print(f"  > Old Threshold: {old_threshold:.6f}")
            print(f"  > New Threshold: {new_threshold:.6f} (Percentile: {normalization_factor*100}%)")
            
            # Save
            with open(threshold_path, 'w') as f:
                f.write(str(new_threshold))
                
            print(f"  > Updated {threshold_path.name}")
            
        except Exception as e:
            print(f"  > Error: {e}")

if __name__ == "__main__":
    calibrate_thresholds(target_rate=0.05) # 5% Anomaly Rate
