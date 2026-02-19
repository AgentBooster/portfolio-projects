import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from data.loader import EnergyDataLoader
from models.gru_forecast import GRUForecaster

def train_all_buildings(epochs=15):
    data_path = "data/processed/synthetic_2022_2026.csv"
    if not Path(data_path).exists():
        print(f"Data file not found: {data_path}")
        return

    # Get list of buildings
    df = pd.read_csv(data_path)
    buildings = df['building_name'].unique()
    
    print(f"Found {len(buildings)} buildings: {buildings}")
    
    reports_dir = Path("reports/figures")
    reports_dir.mkdir(parents=True, exist_ok=True)
    models_dir = Path("models")
    models_dir.mkdir(parents=True, exist_ok=True)
    
    metrics_summary = []

    for b_name in buildings:
        print(f"\n--- Training Forecasting Model for: {b_name} ---")
        
        # 1. Load Data
        loader = EnergyDataLoader(data_path, seq_length=168) 
        data, timestamps = loader.load_and_process(b_name)
        
        if len(data) < 1000:
            print(f"Skipping {b_name}: Insufficient data ({len(data)} rows)")
            continue
            
        # 2. Split
        train_data, test_data = loader.split_train_test(data, train_ratio=0.8)
        
        # 3. Scale
        train_scaled, test_scaled = loader.scale_data(train_data, test_data)
        
        # Save Scaler
        loader.save_scaler(models_dir / f"{b_name}_scaler.pkl")
        
        # 4. Create Sequences
        X_train, y_train = loader.create_sequences(train_scaled)
        X_test, y_test = loader.create_sequences(test_scaled)
        
        # 5. Model
        forecaster = GRUForecaster(
            input_shape=(X_train.shape[1], X_train.shape[2]),
            units_1=64, units_2=32, dropout=0.2
        )
        
        # 6. Train
        val_split = int(len(X_train) * 0.9)
        X_train_final, X_val = X_train[:val_split], X_train[val_split:]
        y_train_final, y_val = y_train[:val_split], y_train[val_split:]
        
        history = forecaster.train(X_train_final, y_train_final, X_val, y_val, epochs=epochs)
        
        # 7. Evaluate
        predictions = forecaster.predict(X_test)
        
        def inverse_transform_target(y_scaled, scaler):
            dummy = np.zeros((len(y_scaled), scaler.n_features_in_))
            dummy[:, 0] = y_scaled.flatten()
            return scaler.inverse_transform(dummy)[:, 0]
            
        y_test_inv = inverse_transform_target(y_test, loader.scaler)
        pred_inv = inverse_transform_target(predictions, loader.scaler)
        
        mae = np.mean(np.abs(y_test_inv - pred_inv))
        rmse = np.sqrt(np.mean((y_test_inv - pred_inv)**2))
        mape = np.mean(np.abs((y_test_inv - pred_inv) / (y_test_inv + 1e-6))) * 100
        
        print(f"{b_name} - Test MAE: {mae:.2f}")
        
        metrics_summary.append({
            "building": b_name,
            "mae": mae,
            "rmse": rmse,
            "mape": mape
        })
        
        # Save Model
        forecaster.save(models_dir / f"{b_name}_gru.keras")
        
        # Plot
        plt.figure(figsize=(15, 6))
        plt.plot(y_test_inv[:300], label='Actual', alpha=0.7)
        plt.plot(pred_inv[:300], label='Predicted', alpha=0.7, linestyle='--')
        plt.title(f'Forecast: {b_name} (Sample)')
        plt.legend()
        plt.savefig(reports_dir / f"{b_name}_forecast.png")
        plt.close()

    # Save Metrics CSV
    pd.DataFrame(metrics_summary).to_csv("reports/forecast_metrics.csv", index=False)
    print("\nTraining Complete for all buildings.")

if __name__ == "__main__":
    train_all_buildings(epochs=10)
