import pandas as pd
import numpy as np
from pathlib import Path
from calendar_mock import generate_calendar
from datetime import datetime

def generate_synthetic_data():
    metadata_path = Path("data/processed/buildings_metadata.csv")
    output_path = Path("data/processed/synthetic_2022_2026.csv")
    
    if not metadata_path.exists():
        print("Metadata file not found.")
        return

    # Load buildings metadata
    df_metadata = pd.read_csv(metadata_path)
    
    # Generate Calendar for 2022 to 2026 (Present)
    years = [2022, 2023, 2024, 2025, 2026]
    calendars = []
    for y in years:
        df_cal = generate_calendar(y)
        # If 2026, cut off at current date (roughly end of Feb)
        if y == 2026:
            cutoff = "2026-03-01"
            df_cal = df_cal.loc[:cutoff]
        calendars.append(df_cal)
        
    df_full_calendar = pd.concat(calendars)
    
    # Result container
    all_data = []
    
    print(f"Generating data for {len(df_metadata)} buildings over {len(years)} years...")
    
    for _, row in df_metadata.iterrows():
        b_name = row['building_name']
        base_yearly_total = row['yearly_consumption_kwh']
        area = row.get('area_m2', 0)
        
        print(f"  > Processing {b_name} (Base 2022: {base_yearly_total:.0f} kWh, Area: {area} m2)")
        
        # We need to simulate year by year to apply variations
        building_chunks = []
        
        for y, df_year_cal in zip(years, calendars):
             # 1. Base Profile Logic (Same as before)
            hours = df_year_cal['hour'].values
            is_weekends = df_year_cal['is_weekend'].values
            is_holidays = df_year_cal['is_holiday'].values
            is_semesters = df_year_cal['is_semester'].values
            
            # Profiles
            morning = 0.6 * np.exp(-((hours - 10)**2) / 8.0)
            afternoon = 0.5 * np.exp(-((hours - 15)**2) / 18.0)
            evening = 0.2 * np.exp(-((hours - 20)**2) / 8.0)
            base = 0.15
            
            raw_profile = base + morning + afternoon + evening
            
            # Multipliers
            semester_mult = np.where(is_semesters == 1, 1.2, 0.7)
            
            final_profile = raw_profile * semester_mult
            
            # Weekend/Holiday corrections
            final_profile = np.where(is_weekends == 1, base * 1.2 + (final_profile - base) * 0.1, final_profile)
            final_profile = np.where(is_holidays == 1, base * 0.8, final_profile)
            
            # Noise
            noise = np.random.normal(0, 0.05, len(final_profile))
            final_profile = final_profile * (1 + noise)
            final_profile = np.maximum(0, final_profile)
            
            # Scale to Yearly Total
            # For 2022: Use exact base_yearly_total
            # For others: Use base * random variation (0.95 to 1.05)
            
            if y == 2022:
                target_total = base_yearly_total
            else:
                # Random variation +/- 5%
                variation = np.random.uniform(0.95, 1.05)
                target_total = base_yearly_total * variation
                
            # Current profile sum
            current_sum = final_profile.sum()
            scaling_factor = target_total / current_sum if current_sum > 0 else 0
            
            consumption_kWh = final_profile * scaling_factor
            
            # Create chunk DF
            chunk_df = df_year_cal.copy()
            chunk_df['building_name'] = b_name
            chunk_df['consumption_kWh'] = consumption_kWh
            chunk_df['area_m2'] = area
            
            building_chunks.append(chunk_df)
            
        # Concat all years for this building
        building_df = pd.concat(building_chunks)
        all_data.append(building_df)
        
    final_df = pd.concat(all_data)
    final_df.reset_index(inplace=True)
    final_df.rename(columns={'index': 'timestamp'}, inplace=True)
    
    # Sort by timestamp then building? Or just keep stacked.
    # Stacked is fine for filtering.
    
    final_df.to_csv(output_path, index=False)
    print(f"Saved extended synthetic data to {output_path}. Shape: {final_df.shape}")

if __name__ == "__main__":
    generate_synthetic_data()
