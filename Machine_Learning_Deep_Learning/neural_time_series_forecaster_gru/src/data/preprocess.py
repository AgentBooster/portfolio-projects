import pandas as pd
from pathlib import Path
import unicodedata

def normalize_name(name):
    if not isinstance(name, str):
        return ""
    # Normalize unicode characters to decompose accents
    nfkd_form = unicodedata.normalize('NFKD', name)
    # Filter out non-spacing mark characters (accents)
    name_ascii = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    # Lowercase and strip
    return name_ascii.lower().strip()

def preprocess_metadata():
    areas_path = Path("data/raw/ÁREAS CAMPUS.xlsx")
    consumos_path = Path("data/raw/Consumos ute 2022.xlsx")
    output_path = Path("data/processed/buildings_metadata.csv")
    
    # 1. Process Areas
    # We found names in col 2 (index 2) and areas in col 3 (index 3)
    # Header is likely row 0 or 1, but we'll specific index loading
    print("Reading Areas...")
    df_areas = pd.read_excel(areas_path, header=None)
    
    # Extract relevant columns: 2 (Name), 3 (Area)
    # Drop rows where Name is NaN
    df_areas_clean = df_areas.iloc[:, [2, 3]].copy()
    df_areas_clean.columns = ["raw_name", "area_m2"]
    df_areas_clean.dropna(subset=["raw_name"], inplace=True)
    
    # Normalize keys
    df_areas_clean["clean_key"] = df_areas_clean["raw_name"].apply(normalize_name)
    
    # Create lookup dict: clean_key -> area
    # Clean duplicates?
    area_map = df_areas_clean.set_index("clean_key")["area_m2"].to_dict()
    print(f"Loaded {len(area_map)} building areas.")
    # Debug print
    # print(area_map)
    
    # 2. Process Consumption
    print("Reading Consumption...")
    # Read ignoring header to find the row with "Edificio ..."
    # Based on previous check, it's roughly row 2 (0-indexed)
    df_consumos = pd.read_excel(consumos_path)
    
    # We need to find the rows where column 0 starts with "Edificio" usually
    # Or just use the pre-known structure: 
    # Row 0: Unnamed: 0, CONSUMO ACTIVO TOTAL
    # Row 1: NaN, 12 MESES
    # Row 2: NaN, kwh
    # Data starts after.
    
    # Let's inspect columns to identify "Unnamed: 0" which holds the names
    # In the raw read, the first column is likely names.
    # We'll reload with header=None to be safe and find the block
    df_c_raw = pd.read_excel(consumos_path, header=None)
    
    buildings_data = []
    
    for idx, row in df_c_raw.iterrows():
        name_candidate = row[0]
        val_candidate = row[1]
        
        if isinstance(name_candidate, str) and ("Edificio" in name_candidate or "Central" in name_candidate):
            # This is likely a data row
            clean_name = normalize_name(name_candidate)
            # Remove "edificio" from key to match Areas keys (e.g. "edificio central" -> "central")
            search_key = clean_name.replace("edificio", "").strip()
            
            # Special case matching
            # Areas has "CENTRAL", Consumos has "Edificio Central" -> key "central" matches "central"
            # Areas has "SEMPRUN", Consumos has "Edificio Semprún" -> key "semprun" matches "semprun"
            
            # Lookup
            if search_key in area_map:
                area = area_map[search_key]
                try:
                    consumption = float(val_candidate)
                except:
                    consumption = 0.0
                    
                buildings_data.append({
                    "building_name": name_candidate.strip(), # Keep original name for display
                    "clean_key": search_key,
                    "yearly_consumption_kwh": consumption,
                    "area_m2": area
                })
            else:
                print(f"Warning: No area found for {name_candidate} (Key: {search_key}) -> Trying partial match?")
                # Fallback: fuzzy match?
                # Iterate area keys and check if they are in search_key
                found = False
                for ak in area_map:
                    if ak in search_key or search_key in ak:
                         buildings_data.append({
                            "building_name": name_candidate.strip(),
                            "clean_key": ak,
                            "yearly_consumption_kwh": float(val_candidate),
                            "area_m2": area_map[ak]
                        })
                         found = True
                         print(f"  -> Matched with {ak}")
                         break
                
                if not found:
                    print(f"  -> CRITICAL: Skipping {name_candidate}")

    # Create DF
    df_final = pd.DataFrame(buildings_data)
    
    # Validation
    if df_final.empty:
        print("Error: No buildings merged!")
        return
        
    print("\nMerged Metadata:")
    print(df_final[["building_name", "yearly_consumption_kwh", "area_m2"]])
    
    df_final.to_csv(output_path, index=False)
    print(f"\nSaved metadata to {output_path}")

if __name__ == "__main__":
    preprocess_metadata()
