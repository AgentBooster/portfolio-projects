import pandas as pd
import os
from pathlib import Path

def ingest_data():
    raw_path = Path("data/raw")
    processed_path = Path("data/processed")
    
    # Ensure directories exist
    processed_path.mkdir(parents=True, exist_ok=True)
    
    # 1. Ingest Areas
    try:
        areas_file = list(raw_path.glob("*REAS CAMPUS*.xlsx"))[0]
        print(f"Reading areas from {areas_file}")
        df_areas = pd.read_excel(areas_file)
        df_areas.to_csv(processed_path / "areas.csv", index=False)
        print("Saved areas.csv")
    except IndexError:
        print("Warning: AREAS CAMPUS file not found.")
    except Exception as e:
        print(f"Error processing areas: {e}")

    # 2. Ingest Consumption
    try:
        consumos_file = list(raw_path.glob("Consumos ute*.xlsx"))[0]
        print(f"Reading consumption from {consumos_file}")
        df_consumos = pd.read_excel(consumos_file)
        df_consumos.to_csv(processed_path / "consumption_raw.csv", index=False)
        print("Saved consumption_raw.csv")
    except IndexError:
        print("Warning: Consumos file not found.")
    except Exception as e:
        print(f"Error processing consumption: {e}")

if __name__ == "__main__":
    ingest_data()
