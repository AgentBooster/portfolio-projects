import os
import sys

# CRITICAL: Must be set BEFORE importing ANY libraries that might use Metal/Accelerate
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import numpy as np
import pandas as pd
import matplotlib
# Force non-interactive backend for server/background execution
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
import joblib

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

# CRITICAL: Explicitly disable GPU visibility in TF
import tensorflow as tf
try:
    tf.config.set_visible_devices([], 'GPU')
    visible_devices = tf.config.get_visible_devices()
    print(f"CUDA/Metal Disabled. Visible devices: {visible_devices}")
except Exception as e:
    print(f"Could not disable GPU: {e}")

from data.loader import EnergyDataLoader
from models.gru_anomaly import GRUAnomalyDetector

def train_all_anomalies(epochs=15):
    data_path = "data/processed/synthetic_2022_2026.csv"
    if not Path(data_path).exists():
        print(f"Data file not found: {data_path}")
        return

    # Get list of buildings
    df = pd.read_csv(data_path)
    buildings = df['building_name'].unique()
    
    reports_dir = Path("reports/figures")
    reports_dir.mkdir(parents=True, exist_ok=True)
    models_dir = Path("models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    anomaly_summary = []

    for b_name in buildings:
        print(f"\n--- Training Anomaly Detector for: {b_name} ---")
        
        # 1. Load Data
        loader = EnergyDataLoader(data_path, seq_length=168)
        data, _ = loader.load_and_process(b_name)
        
        if len(data) < 1000:
            continue
            
        # 2. Split
        train_data, test_data = loader.split_train_test(data, train_ratio=0.8)
        
        # 3. Scale (Reuse forecasting scaler if available)
        scaler_path = models_dir / f"{b_name}_scaler.pkl"
        if scaler_path.exists():
            print(f"Loading existing scaler from {scaler_path}")
            loader.load_scaler(scaler_path)
            # Use transform only, do NOT re-fit
            train_scaled = loader.scaler.transform(train_data)
            test_scaled = loader.scaler.transform(test_data)
        else:
            print("Fitting new scaler...")
            train_scaled, test_scaled = loader.scale_data(train_data, test_data)
            # Save it so it matches forecasting
            joblib.dump(loader.scaler, scaler_path)
            
        # CRITICAL: Fix for Mac/Metal hang in Training
        # 1. Cast to float32 (TensorFlow default)
        # 2. Ensure contiguous memory layout
        train_scaled = np.ascontiguousarray(train_scaled.astype(np.float32))
        test_scaled = np.ascontiguousarray(test_scaled.astype(np.float32))
        
        # 4. Sequences
        X_train, _ = loader.create_sequences(train_scaled)
        X_test, _ = loader.create_sequences(test_scaled)
        
        # 5. Model
        detector = GRUAnomalyDetector(
            input_shape=(X_train.shape[1], X_train.shape[2]),
            latent_dim=32
        )
        
        # 6. Train
        val_split = int(len(X_train) * 0.9)
        X_train_final, X_val = X_train[:val_split], X_train[val_split:]
        
        # Optimize batch size for CPU (bigger batches = faster linear algebra)
        history = detector.train(X_train_final, X_val, epochs=epochs, batch_size=512)
        
        # 7. Threshold
        threshold = detector.find_threshold(X_val, percentile=99)
        print(f"Threshold (99th): {threshold}")
        
        # Save Threshold
        with open(models_dir / f"{b_name}_threshold.txt", "w") as f:
            f.write(str(threshold))
            
        # Save Model
        detector.save(models_dir / f"{b_name}_autoencoder.keras")
        
        # 8. Evaluate on Test (Synthetic should be clean)
        anomalies, errors = detector.detect(X_test)
        num_anomalies = np.sum(anomalies)
        
        anomaly_summary.append({
            "building": b_name,
            "threshold": threshold,
            "test_anomalies": num_anomalies,
            "mean_reconstruction_error": np.mean(errors)
        })
        
        # Plot
        plt.figure(figsize=(15, 6))
        plt.plot(errors, label='Reconstruction Error')
        plt.hlines(threshold, 0, len(errors), colors='r', label='Threshold')
        plt.title(f'Anomaly Detection: {b_name} (Test Set)')
        plt.legend()
        plt.savefig(reports_dir / f"{b_name}_anomaly_errors.png")
        plt.close()

    # Save Metrics CSV
    pd.DataFrame(anomaly_summary).to_csv("reports/anomaly_metrics.csv", index=False)
    print("\nAnomaly Training Complete for all buildings.")

if __name__ == "__main__":
    # Epochs can be lower for anomaly since unsupervised task is easier to converge for reconstruction
    train_all_anomalies(epochs=10)
