import pandas as pd
import numpy as np

# --- Global KPI Logic (Green Metric) ---

# Dynamic Tariff (Grandes Consumidores GC2 - Uruguay)
PRICE_VALLE = 2.433  # 00:00 - 07:00
PRICE_LLANO = 4.250  # 07:00 - 18:00 & 22:00 - 00:00 (+Weekends & Holidays)
PRICE_PUNTA = 5.218  # 18:00 - 22:00 (Mon-Fri only, Non-Holidays)

# Fixed Holidays (Uruguay Non-Working) - Simplification for MVP
FIXED_HOLIDAYS = [
    (1, 1),   # Año Nuevo
    (1, 6),   # Reyes (Simulated)
    (5, 1),   # Día del Trabajador
    (7, 18),  # Jura de la Constitución
    (8, 25),  # Declaratoria de la Independencia
    (11, 2),  # Difuntos (Often University Holiday)
    (12, 25)  # Navidad
]

# Dynamic CO2 Emissions (Official MIEM Factors)
EMISSION_FACTORS = {
    2022: 0.0601,
    2023: 0.0560,
    2024: 0.0060, # Rainy year outlier
    2025: 0.0112  # Preliminary
}
FALLBACK_EMISSION_FACTOR = 0.0560 # Conservative baseline (2023) for future

def get_energy_price_vectorized(timestamps):
    """Calculates energy price vector based on UTE GC2 tariff."""
    # Ensure timestamps is a Series
    if not isinstance(timestamps, pd.Series):
        timestamps = pd.Series(timestamps)

    hours = timestamps.dt.hour
    month_days = list(zip(timestamps.dt.month, timestamps.dt.day))
    
    # Boolean masks
    is_weekend = timestamps.dt.dayofweek >= 5
    is_holiday = [md in FIXED_HOLIDAYS for md in month_days]
    is_no_peak_day = is_weekend | np.array(is_holiday)
    
    # Default to LLANO
    prices = pd.Series(PRICE_LLANO, index=timestamps.index)
    
    # Rule 1: Valle (00-07) - All days
    prices.mask((hours >= 0) & (hours < 7), PRICE_VALLE, inplace=True)
    
    # Rule 2: Punta (18-22) - Mon-Fri Only AND Non-Holiday
    mask_punta = (hours >= 18) & (hours < 22) & (~is_no_peak_day)
    prices.mask(mask_punta, PRICE_PUNTA, inplace=True)
    
    return prices

def get_emission_factor_vectorized(timestamps):
    """Retrieves emission factor based on year (MIEM)."""
    if not isinstance(timestamps, pd.Series):
        timestamps = pd.Series(timestamps)
    years = timestamps.dt.year
    return years.map(EMISSION_FACTORS).fillna(FALLBACK_EMISSION_FACTOR)
