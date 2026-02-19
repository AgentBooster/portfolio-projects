import sys
import os
import numpy as np
import tensorflow as tf
from pathlib import Path
import pandas as pd # Added pandas

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from data.loader import EnergyDataLoader

def audit_all_buildings():
    print("--- STARTING CAMPUS-WIDE AUDIT ---")
    data_path = "data/processed/synthetic_2022_2026.csv"
    models_dir = Path("models")
    
    if not Path(data_path).exists():
        print("Data not found.")
        return

    # Load All Data Names
    df_all = pd.read_csv(data_path)
    buildings = df_all['building_name'].unique()
    
    final_report = []
    final_report.append("=== UCU ENERGY SYSTEM: FINAL AUDIT REPORT ===")
    final_report.append(f"Date: {pd.Timestamp.now()}")
    final_report.append(f"Total Buildings Verified: {len(buildings)}\n")
    
    for b_name in buildings:
        print(f"Auditing {b_name}...")
        report_lines = []
        report_lines.append(f"--- Building: {b_name} ---")
        
        # Paths
        forecast_model_path = models_dir / f"{b_name}_gru.keras"
        anomaly_model_path = models_dir / f"{b_name}_autoencoder.keras"
        threshold_path = models_dir / f"{b_name}_threshold.txt"
        scaler_path = models_dir / f"{b_name}_scaler.pkl"
        
        # Check integrity
        missing_files = []
        if not forecast_model_path.exists(): missing_files.append("GRU Model")
        if not anomaly_model_path.exists(): missing_files.append("AE Model")
        if not scaler_path.exists(): missing_files.append("Scaler")
        
        if missing_files:
            report_lines.append(f"[CRITICAL] Missing Artifacts: {', '.join(missing_files)}")
            final_report.extend(report_lines)
            continue

        # Load Data
        loader = EnergyDataLoader(data_path, seq_length=168)
        data, timestamps = loader.load_and_process(b_name, existing_df=df_all)
        
        # Split (Same as Training)
        train_data, test_data = loader.split_train_test(data, train_ratio=0.8)
        
        # Load Scaler
        try:
            loader.load_scaler(scaler_path)
        except:
             report_lines.append(f"[ERROR] Scaler Load Failed")
             final_report.extend(report_lines)
             continue
             
        # Scale & Create Sequences (Evaluation on TEST set)
        # Note: We use the *loaded* scaler to transform test data
        test_scaled = loader.scaler.transform(test_data)
        X_test, y_test = loader.create_sequences(test_scaled)
        
        if len(X_test) == 0:
            report_lines.append("[WARN] Not enough test data for sequences.")
            final_report.extend(report_lines)
            continue

        # 1. Forecast Audit
        try:
            model = tf.keras.models.load_model(forecast_model_path, compile=False)
            predictions = model.predict(X_test, verbose=0)
            
            # Inverse Transform
            def inverse_transform_target(y_scaled, scaler):
                dummy = np.zeros((len(y_scaled), scaler.n_features_in_))
                dummy[:, 0] = y_scaled.flatten()
                return scaler.inverse_transform(dummy)[:, 0]
                
            y_test_inv = inverse_transform_target(y_test, loader.scaler)
            pred_inv = inverse_transform_target(predictions, loader.scaler)
            
            mae = np.mean(np.abs(y_test_inv - pred_inv))
            rmse = np.sqrt(np.mean((y_test_inv - pred_inv)**2))
            
            # Crash Check (Flatline)
            std_dev_pred = np.std(pred_inv)
            
            # Scale Check (Absurd)
            mean_pred = np.mean(pred_inv)
            
            # Physics Check (Negative)
            min_pred = np.min(pred_inv)
            
            status = "OK"
            if std_dev_pred < 0.1: status = "FAIL (Flatline)"
            if mean_pred < 1 or mean_pred > 100000: status = "FAIL (Bad Scale)"
            if min_pred < -5: status = "FAIL (Negative Energy)" # Tolerance -5 for float noise close to 0
            
            report_lines.append(f"[Forecast GRU]")
            report_lines.append(f"  > Status: {status}")
            report_lines.append(f"  > Test MAE: {mae:.2f} kWh")
            report_lines.append(f"  > Test RMSE: {rmse:.2f} kWh")
            
        except Exception as e:
            report_lines.append(f"[Forecast GRU] Error: {str(e)}")

        # 2. Anomaly Audit
        try:
            model_ae = tf.keras.models.load_model(anomaly_model_path, compile=False)
            reconstructions = model_ae.predict(X_test, verbose=0)
            mse = np.mean(np.power(X_test - reconstructions, 2), axis=(1, 2))
            
            if threshold_path.exists():
                with open(threshold_path, 'r') as f:
                    threshold = float(f.read())
            else:
                threshold = 0.0
                
            anomalies = mse > threshold
            anomaly_rate = np.mean(anomalies) * 100
            
            report_lines.append(f"[Anomaly AE]")
            report_lines.append(f"  > Threshold (99th): {threshold:.4f}")
            report_lines.append(f"  > Detected Rate: {anomaly_rate:.2f}% (Expected ~1-5%)")
            
        except Exception as e:
            report_lines.append(f"[Anomaly AE] Error: {str(e)}")

        report_lines.append("")
        final_report.extend(report_lines)

    return "\n".join(final_report)

if __name__ == "__main__":
    report = audit_all_buildings()
    
    output_path = Path("reports/final_audit_integrity.txt")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, "w") as f:
        f.write(report)
        
    print(f"Report saved to {output_path}")
    print(report)
