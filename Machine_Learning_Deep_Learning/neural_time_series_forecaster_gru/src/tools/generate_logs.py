import pandas as pd
import numpy as np
import os
# CRITICAL: Must be set BEFORE importing tensorflow
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import tensorflow as tf
import joblib
from pathlib import Path
import sys
import os
import gc

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))
from data.loader import EnergyDataLoader

def generate_logs():
    data_path = "data/processed/synthetic_2022_2026.csv"
    models_dir = Path("models")
    output_path = "data/processed/prediction_logs.csv"
    
    if not Path(data_path).exists():
        print("Data not found.")
        return

    print("Loading full dataset once...")
    df_all = pd.read_csv(data_path)
    buildings = df_all['building_name'].unique()
    
    all_logs = []
    
    for b_name in buildings:
        print(f"Processing {b_name}...")
        
        # Explicit garbage collection
        gc.collect()
        tf.keras.backend.clear_session()
        
        # Load Model & Scaler
        model_path = models_dir / f"{b_name}_gru.keras"
        scaler_path = models_dir / f"{b_name}_scaler.pkl"
        
        if not model_path.exists() or not scaler_path.exists():
            print(f"Skipping {b_name} (Missing model/scaler)")
            continue
            
        try:
            model = tf.keras.models.load_model(model_path, compile=False)
            scaler = joblib.load(scaler_path)
        except Exception as e:
            print(f"Error loading model/scaler for {b_name}: {e}")
            continue
        
        # Process Data using cached DF
        loader = EnergyDataLoader(data_path, seq_length=168)
        data, timestamps = loader.load_and_process(b_name, existing_df=df_all)
        
        # Last 1000 points
        if len(data) < 1000:
            limit = len(data)
        else:
            limit = 1000
            
        subset_data = data[-limit:]
        subset_timestamps = timestamps[-limit:]
        
        # Scale
        loader.scaler = scaler
        subset_scaled = scaler.transform(subset_data)
        
        # Create Sequences
        X, y = loader.create_sequences(subset_scaled)
        
        if len(X) == 0:
            continue
            
        # Predict
        preds_scaled = model.predict(X, verbose=0)
        
        # Inverse Transform
        def inverse_1d(arr_1d, scl):
            dummy = np.zeros((len(arr_1d), scl.n_features_in_))
            dummy[:, 0] = arr_1d.flatten()
            return scl.inverse_transform(dummy)[:, 0]
            
        y_actual = inverse_1d(y, scaler)
        y_pred = inverse_1d(preds_scaled, scaler)
        
        valid_timestamps = subset_timestamps[loader.seq_length:]
        
        df_log = pd.DataFrame({
            'timestamp': valid_timestamps,
            'building_name': b_name,
            'actual_kWh': y_actual,
            'predicted_kWh': y_pred
        })
        
        df_log['delta_kWh'] = df_log['actual_kWh'] - df_log['predicted_kWh']
        df_log['abs_error'] = df_log['delta_kWh'].abs()
        
        all_logs.append(df_log)

    if all_logs:
        final_log = pd.concat(all_logs)
        final_log.to_csv(output_path, index=False)
        print(f"Saved {len(final_log)} prediction logs to {output_path}")
    else:
        print("No logs generated.")

if __name__ == "__main__":
    generate_logs()
