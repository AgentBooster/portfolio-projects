import os
import sys

# CRITICAL: Force CPU for API to avoid Metal hangs
# Must be set BEFORE importing tensorflow
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import sqlite3
import json
import datetime
from typing import Optional, List, Dict, Any

# Ensure src module is in path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src'))
from data.loader import EnergyDataLoader
from dashboard.core import run_inference_core, run_future_forecast

# GLOBAL STATE
MODELS = {}
SCALERS = {}
THRESHOLDS = {}
DATA_LOADER = None
ENABLE_SQLITE = os.getenv("ENABLE_SQLITE", "false").lower() == "true"
DB_PATH = os.path.join(os.path.dirname(__file__), '../../sgee_logs.db')

def init_db():
    """Initializes SQLite tables if enabled."""
    if not ENABLE_SQLITE:
        return
    
    print(f"💽 SQLite Persistence Enabled. DB Path: {DB_PATH}")
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        # Audit Table
        c.execute('''
            CREATE TABLE IF NOT EXISTS audit_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                building TEXT NOT NULL,
                start_date TEXT,
                end_date TEXT,
                total_waste_kwh REAL,
                total_waste_cost REAL,
                total_waste_co2 REAL,
                anomaly_count INTEGER,
                context_log TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Forecast Table
        c.execute('''
            CREATE TABLE IF NOT EXISTS forecast_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                building TEXT NOT NULL,
                horizon_days INTEGER,
                total_projected_kwh REAL,
                projected_cost REAL,
                projected_co2 REAL,
                peak_load_kwh REAL,
                context_log TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"❌ Database Init Error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load models and data once at startup.
    """
    print("🚀 API SGEE: Starting up & Loading Models...")
    
    # Paths
    base_path = os.path.dirname(__file__)
    project_root = os.path.join(base_path, '../..')
    models_dir = os.path.join(project_root, 'models')
    data_path = os.path.join(project_root, 'data/processed/synthetic_2022_2026.csv')
    
    # Load Data Loader (Structure only, or pre-load data if small enough)
    # For now, we initialize it.
    global DATA_LOADER
    DATA_LOADER = EnergyDataLoader(data_path, seq_length=168)
    
    # Pre-load all data into memory to avoid repeated I/O
    print("💾 Caching dataset in memory...")
    try:
        # Load full DF into loader's internal state or a global cache
        # Since loader doesn't have a persistent 'self.data' for all buildings, 
        # we can just read it once and let OS cache handle it, 
        # OR better: read it into specific variable if we want extreme speed.
        # But EnergyDataLoader reads from path. 
        # Making it read from dataframe requires modifying loader or just relying on OS cache (which is fast for 19MB).
        # Let's stick to standard loader usage but ensure models are cached.
        pass
    except Exception as e:
        print(f"⚠️ Warning: Could not cache data: {e}")

    # Pre-load models for known buildings
    building_names = [
        "Edificio Apolonia", "Edificio Athanasius", "Edificio Central", 
        "Edificio Madre Marta", "Edificio Mullin", "Edificio Semprún", "Edificio Xalambrí"
    ]
    
    for b_name in building_names:
        try:
            # Model Forecasting
            m_path = os.path.join(models_dir, f"{b_name}_gru.keras")
            if os.path.exists(m_path):
                print(f"Loading GRU for {b_name}...")
                MODELS[b_name] = tf.keras.models.load_model(m_path, compile=False)
            
            # Anomaly Model
            a_path = os.path.join(models_dir, f"{b_name}_autoencoder.keras")
            if os.path.exists(a_path):
                MODELS[f"{b_name}_ae"] = tf.keras.models.load_model(a_path, compile=False)
                
            # Scaler
            s_path = os.path.join(models_dir, f"{b_name}_scaler.pkl")
            if os.path.exists(s_path):
                SCALERS[b_name] = joblib.load(s_path)
            
            # Threshold
            t_path = os.path.join(models_dir, f"{b_name}_threshold.txt")
            if os.path.exists(t_path):
                with open(t_path, 'r') as f:
                    THRESHOLDS[b_name] = float(f.read())
                    
        except Exception as e:
            print(f"❌ Error loading assets for {b_name}: {e}")

    print("✅ Startup Complete. Models Ready.")
    
    # Init DB
    if ENABLE_SQLITE:
        init_db()
        
    yield
    print("🛑 Shutting down...")
    MODELS.clear()

app = FastAPI(
    title="SGEE Energy Forecaster API",
    description="Production API for forecasting energy consumption and detecting anomalies in UCU buildings.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    building_name: str
    timestamp: str  # Format: "YYYY-MM-DD HH:MM"

class PredictResponse(BaseModel):
    building: str
    timestamp: str
    predicted_kwh: float
    projected_cost_uyu: float
    projected_co2_kg: float
    anomaly_score: float
    is_anomaly: bool
    status: str

class AnalysisRequestBatch(BaseModel):
    building_name: str
    start_date: str # YYYY-MM-DD
    end_date: str   # YYYY-MM-DD

class ForecastRequestBatch(BaseModel):
    building_name: str
    horizon_days: int

class BatchAnalysisResponse(BaseModel):
    timestamps: List[str]
    actual_kwh: List[float]
    predicted_kwh: List[float]
    reconstruction_error: List[float]
    anomaly_status: List[bool]
    # Aggregate Metrics
    total_actual_kwh: float
    total_predicted_kwh: float
    total_waste_kwh: float
    # Green Metric KPIs
    total_waste_cost_uyu: float
    total_waste_co2_kg: float
    energy_intensity_kwh_m2: float
    # New Per-m2 Metrics (Parity)
    cost_uyu_m2: float = 0.0
    co2_kg_m2: float = 0.0
    waste_kwh_m2: float = 0.0
    anomaly_count: int
    context_log: Optional[str] = None

class BatchForecastResponse(BaseModel):
    timestamps: List[str]
    predicted_kwh: List[float]
    # Projected Metrics
    total_projected_kwh: float
    projected_intensity_kwh_m2: float
    projected_cost_uyu: float
    projected_co2_kg: float
    # New Per-m2 Metrics
    cost_uyu_m2: float = 0.0
    co2_kg_m2: float = 0.0
    peak_load_kwh: float
    peak_timestamp: str
    context_log: Optional[str] = None # For Agent Context

# --- Logging Models ---

class AuditLogRequest(BaseModel):
    building: str
    start_date: str
    end_date: str
    total_waste_kwh: float
    total_waste_cost: float
    total_waste_co2: float
    anomaly_count: int
    context_log: str

class ForecastLogRequest(BaseModel):
    building: str
    horizon_days: int
    total_projected_kwh: float
    projected_cost: float
    projected_co2: float
    peak_load_kwh: float
    context_log: str

class LogResponse(BaseModel):
    status: str
    id: Optional[int] = None

class LatestLogResponse(BaseModel):
    type: str # 'audit' or 'forecast'
    timestamp: str
    data: Dict[str, Any]

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "service": "sgee-api",
        "loaded_models": list(MODELS.keys())
    }

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    """
    Generate a forecast and anomaly check using pre-loaded models.
    """
    b_name = request.building_name
    
    if b_name not in MODELS or b_name not in SCALERS:
         raise HTTPException(status_code=404, detail=f"Model/Scaler not found for {b_name}")

    if DATA_LOADER is None:
         raise HTTPException(status_code=500, detail="Data loader not initialized")
         
    try:
        # 1. Get processed data for building
        # Note: load_and_process reads CSV. For 19MB it's millisecond-fast on SSD.
        # Ideally we'd pass an in-memory DF here, but EnergyDataLoader api expects file path.
        data, timestamps = DATA_LOADER.load_and_process(b_name)
        
        # 2. Find index
        try:
            target_ts = pd.Timestamp(request.timestamp)
            target_np = np.datetime64(target_ts)
        except Exception:
             raise HTTPException(status_code=400, detail="Invalid timestamp format")
        
        indices = np.where(timestamps == target_np)[0]
        if len(indices) == 0:
             raise HTTPException(status_code=404, detail=f"Date {request.timestamp} not found in history")
             
        idx = indices[0]
        if idx < DATA_LOADER.seq_length:
             raise HTTPException(status_code=400, detail="Not enough history for this timestamp")
             
        # 3. Create Vector
        input_seq = data[idx - DATA_LOADER.seq_length : idx]
        
        # Scale
        scaler = SCALERS[b_name]
        DATA_LOADER.scaler = scaler
        
        input_scaled = scaler.transform(input_seq)
        input_reshaped = input_scaled.reshape(1, DATA_LOADER.seq_length, -1)
        
        # CRITICAL: Fix for Mac/Metal hang
        # 1. Cast to float32
        # 2. Ensure contiguous memory layout
        input_reshaped = np.ascontiguousarray(input_reshaped.astype(np.float32))
        
        # 4. Predict FORECAST
        model = MODELS[b_name]
        with tf.device('/CPU:0'):
            # Direct call to avoid Keras predict loop overhead
            prediction_scaled = model(input_reshaped, training=False).numpy()
            
        dummy = np.zeros((1, scaler.n_features_in_))
        dummy[:, 0] = prediction_scaled.flatten()
        prediction_kwh = scaler.inverse_transform(dummy)[0, 0]
        
        # 5. Predict ANOMALY
        is_anomaly = False
        anomaly_score = 0.0
        
        ae_key = f"{b_name}_ae"
        if ae_key in MODELS:
            ae_model = MODELS[ae_key]
            with tf.device('/CPU:0'):
                reconstruction = ae_model(input_reshaped, training=False).numpy()
            
            mse = np.mean(np.power(input_reshaped - reconstruction, 2))
            anomaly_score = float(mse)
            
            threshold = THRESHOLDS.get(b_name, 999.9)
            is_anomaly = mse > threshold

        # 6. Green Metric KPIs (Projected)
        # Financial (GC2 Tariff)
        ts = pd.Timestamp(request.timestamp)
        hour = ts.hour
        is_weekend = ts.dayofweek >= 5
        is_holiday = (ts.month, ts.day) in [(1,1), (1,6), (5,1), (7,18), (8,25), (11,2), (12,25)]
        
        if 0 <= hour < 7: 
            price = 2.433
        elif (18 <= hour < 22) and not is_weekend and not is_holiday: 
            price = 5.218 
        else: 
            price = 4.250
            
        proj_cost = float(prediction_kwh) * price
        
        # Environmental (MIEM Factor)
        # Default conservative 0.056 for future/unknown
        factor = 0.056 
        if ts.year == 2024: factor = 0.006 
        if ts.year == 2022: factor = 0.060
        
        proj_co2 = float(prediction_kwh) * factor

        return PredictResponse(
            building=b_name,
            timestamp=request.timestamp,
            predicted_kwh=round(float(prediction_kwh), 2),
            projected_cost_uyu=round(proj_cost, 2),
            projected_co2_kg=round(proj_co2, 3),
            anomaly_score=round(anomaly_score, 4),
            is_anomaly=bool(is_anomaly),
            status="Anomaly Detected 🔴" if is_anomaly else "Normal 🟢"
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- BATCH ENDPOINTS (For Dashboard 2.0) ---

@app.post("/api/v1/analyze/batch", response_model=BatchAnalysisResponse)
def analyze_batch(request: AnalysisRequestBatch):
    """
    Batch Historical Analysis. Wraps logic from dashboard/core.py.
    """
    b_name = request.building_name
    
    # Validation
    if b_name not in MODELS:
        raise HTTPException(status_code=404, detail=f"Model not found for {b_name}")
        
    try:
        # Load Data needed for the core function
        # We need the full dataframe for context
        # In a real production system we might query a DB, but here we use the loaded CSV in DATA_LOADER or load it fresh
        # core.py functions expect a DataFrame for the building. 
        # let's rely on DATA_LOADER.load_and_process or core.load_data_core? 
        # core.run_inference_core takes (building, df_building, start, end, models)
        # We need df_building with raw timestamps and consumption. 
        
        # We can use DATA_LOADER to get the data, but run_inference_core expects a DataFrame with specific columns.
        # Let's import load_data_core from core to be safe and consistent with Gradio app
        # Core Imports
        from dashboard.core import load_data_core, run_inference_core
        from dashboard.kpi_utils import get_energy_price_vectorized, get_emission_factor_vectorized
        
        # NOTE: This might be inefficient to load every time, but OS caching makes it fast. 
        # Ideally we cache this in GLOBAL STATE 'DF' like in Gradio.
        # Let's add a global DF cache in this API if performance is an issue. 
        # For now, let's try to reuse DATA_LOADER's internal logic or just load it.
        # Actually, let's ADD A GLOBAL DF to this API to avoid reloading csv on every request
        global DF_CACHE, META_CACHE
        if 'DF_CACHE' not in globals() or DF_CACHE is None:
             print("Loading Global API Data Cache...")
             DF_CACHE, META_CACHE, _ = load_data_core()

        df_building = DF_CACHE[DF_CACHE['building_name'] == b_name].sort_values('timestamp')
        
        # Construct Models Dict (Expected by core.py)
        building_models = {
            'gru': MODELS.get(b_name),
            'ae': MODELS.get(f"{b_name}_ae"),
            'scaler': SCALERS.get(b_name),
            'threshold': THRESHOLDS.get(b_name, 9999)
        }

        # Run Inference
        results = run_inference_core(b_name, df_building, request.start_date, request.end_date, building_models)
        
        if results.empty:
             return BatchAnalysisResponse(
                 timestamps=[], actual_kwh=[], predicted_kwh=[], reconstruction_error=[], anomaly_status=[],
                 total_actual_kwh=0, total_predicted_kwh=0, total_waste_kwh=0,
                 total_waste_cost_uyu=0, total_waste_co2_kg=0, energy_intensity_kwh_m2=0, anomaly_count=0,
                 context_log="No data available for this range."
             )
             
        # KPI Calculation (Backend Derived)
        total_actual = results['actual_kWh'].sum()
        total_predicted = results['predicted_kWh'].sum()
        
        # Waste
        waste_series = (results['actual_kWh'] - results['predicted_kWh']).clip(lower=0)
        total_waste = waste_series.sum()
        
        # Cost (Vectorized)
        prices = get_energy_price_vectorized(results['timestamp'])
        waste_costs = waste_series * prices
        total_waste_cost = waste_costs.sum()
        
        # CO2
        factors = get_emission_factor_vectorized(results['timestamp'])
        waste_co2 = waste_series * factors
        total_waste_co2 = waste_co2.sum()
        
        # Anomalies
        if 'reconstruction_error' in results.columns:
            rec_errors = results['reconstruction_error'].fillna(0).tolist()
            anomalies = results['is_anomaly'].fillna(False).tolist()
            anomaly_cnt = results['is_anomaly'].sum()
        else:
            rec_errors = [0.0] * len(results)
            anomalies = [False] * len(results)
            anomaly_cnt = 0
            
        # Intensity & Per-m2 Metrics
        intensity = 0.0
        cost_m2 = 0.0
        co2_m2 = 0.0
        waste_m2 = 0.0
        
        if not META_CACHE.empty:
            area = META_CACHE.loc[META_CACHE['building_name'] == b_name, 'area_m2'].values[0]
            if area > 0:
                intensity = total_actual / area
                cost_m2 = total_waste_cost / area
                co2_m2 = total_waste_co2 / area
                waste_m2 = total_waste / area

        # --- Context Generation (Mirrors Gradio Logic) ---
        context_str = f"""
        ROLE: You are the 'Green Metric Strategy Consultant' for UCU.
        CONTEXT:
        - Building: {b_name}
        - Dates: {request.start_date} to {request.end_date}
        - Total Actual: {total_actual:.2f} kWh
        - Total Predicted: {total_predicted:.2f} kWh
        - WASTE COST: ${total_waste_cost:,.2f} UYU
        - WASTE CO2: {total_waste_co2:.2f} kg
        - WASTE INTENSITY: {waste_m2:.4f} kWh/m2
        - Anomalies: {anomaly_cnt}
        """
        if anomaly_cnt > 0:
             # Find indices of anomalies
             anom_indices = [i for i, x in enumerate(anomalies) if x]
             # Get top 3 by reconstruction error
             top_indices = sorted(anom_indices, key=lambda i: rec_errors[i], reverse=True)[:3]
             context_str += "\\nTop Anomalies Detected:\\n"
             for idx in top_indices:
                 if idx < len(results):
                      ts_str = results['timestamp'].iloc[idx].strftime('%Y-%m-%d %H:%M')
                      err_val = rec_errors[idx]
                      context_str += f"- {ts_str}: Error {err_val:.4f}\\n"

        return BatchAnalysisResponse(
            timestamps=results['timestamp'].dt.strftime('%Y-%m-%d %H:%M').tolist(),
            actual_kwh=results['actual_kWh'].round(2).tolist(),
            predicted_kwh=results['predicted_kWh'].round(2).tolist(),
            reconstruction_error=[round(x, 5) for x in rec_errors],
            anomaly_status=anomalies,
            total_actual_kwh=round(total_actual, 2),
            total_predicted_kwh=round(total_predicted, 2),
            total_waste_kwh=round(total_waste, 2),
            total_waste_cost_uyu=round(total_waste_cost, 2),
            total_waste_co2_kg=round(total_waste_co2, 3),
            energy_intensity_kwh_m2=round(intensity, 2),
            
            # New Metrics
            cost_uyu_m2=round(cost_m2, 2),
            co2_kg_m2=round(co2_m2, 4),
            waste_kwh_m2=round(waste_m2, 4),
            
            anomaly_count=int(anomaly_cnt),
            context_log=context_str
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/v1/forecast/batch", response_model=BatchForecastResponse)
def forecast_batch(request: ForecastRequestBatch):
    """
    Batch Future Forecast. Wraps logic from dashboard/core.py.
    """
    b_name = request.building_name
    
    if b_name not in MODELS:
        raise HTTPException(status_code=404, detail=f"Model not found for {b_name}")

    # Ensure Cache
    global DF_CACHE, META_CACHE
    if 'DF_CACHE' not in globals() or DF_CACHE is None:
         from dashboard.core import load_data_core
         DF_CACHE, META_CACHE, _ = load_data_core()

    df_building = DF_CACHE[DF_CACHE['building_name'] == b_name].sort_values('timestamp')
    
    from dashboard.kpi_utils import get_energy_price_vectorized, get_emission_factor_vectorized

    # Construct Models Dict (Expected by core.py)
    building_models = {
        'gru': MODELS.get(b_name),
        'ae': MODELS.get(f"{b_name}_ae"),
        'scaler': SCALERS.get(b_name),
        'threshold': THRESHOLDS.get(b_name, 9999) # Default threshold if missing
    }

    try:
        results, status = run_future_forecast(b_name, df_building, request.horizon_days, building_models)
        
        if results is None:
             raise HTTPException(status_code=400, detail=status)
             
        # Metrics
        total_pred = results['predicted_kWh'].sum()
        
        # Cost
        prices = get_energy_price_vectorized(results['timestamp'])
        costs = results['predicted_kWh'] * prices
        total_cost = costs.sum()
        
        # CO2
        factors = get_emission_factor_vectorized(results['timestamp'])
        co2s = results['predicted_kWh'] * factors
        total_co2 = co2s.sum()
        
        # Peak
        peak_idx = results['predicted_kWh'].idxmax()
        peak_kwh = results.loc[peak_idx, 'predicted_kWh']
        peak_ts = results.loc[peak_idx, 'timestamp']
        
        # Intensity & Per-m2
        intensity = 0.0
        cost_m2 = 0.0
        co2_m2 = 0.0
        
        if not META_CACHE.empty:
            area = META_CACHE.loc[META_CACHE['building_name'] == b_name, 'area_m2'].values[0]
            if area > 0:
                intensity = total_pred / area
                cost_m2 = total_cost / area
                co2_m2 = total_co2 / area
                
        # --- Context Generation ---
        context_str = f"""
        Future Forecast Context (Generated Plan):
        Building: {b_name}
        Horizon: {request.horizon_days} days
        Projected Consumption: {total_pred:.2f} kWh
        Projected Intensity: {intensity:.2f} kWh/m2
        Projected Cost: ${total_cost:,.2f} UYU
        Projected CO2: {total_co2:.2f} kg
        Peak Load: {peak_kwh:.2f} kWh at {peak_ts}
        Status: Valid Autoregressive Projection.
        """

        return BatchForecastResponse(
            timestamps=results['timestamp'].dt.strftime('%Y-%m-%d %H:%M').tolist(),
            predicted_kwh=results['predicted_kWh'].round(2).tolist(),
            total_projected_kwh=round(total_pred, 2),
            projected_intensity_kwh_m2=round(intensity, 2),
            projected_cost_uyu=round(total_cost, 2),
            projected_co2_kg=round(total_co2, 3),
            
            # New Metrics
            cost_uyu_m2=round(cost_m2, 2),
            co2_kg_m2=round(co2_m2, 4),
            
            peak_load_kwh=round(peak_kwh, 2),
            peak_timestamp=peak_ts.strftime('%Y-%m-%d %H:%M'),
            context_log=context_str
        )
        
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Forecast failed: {str(e)}")

# --- LOGGING ENDPOINTS (Optional) ---

@app.post("/api/v1/logs/audit", response_model=LogResponse)
def log_audit(request: AuditLogRequest):
    if not ENABLE_SQLITE:
        return LogResponse(status="Ignored (SQLite Disabled)")
        
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            INSERT INTO audit_runs (building, start_date, end_date, total_waste_kwh, total_waste_cost, total_waste_co2, anomaly_count, context_log)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (request.building, request.start_date, request.end_date, request.total_waste_kwh, request.total_waste_cost, request.total_waste_co2, request.anomaly_count, request.context_log))
        
        last_id = c.lastrowid
        conn.commit()
        conn.close()
        return LogResponse(status="Saved", id=last_id)
        
    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@app.post("/api/v1/logs/forecast", response_model=LogResponse)
def log_forecast(request: ForecastLogRequest):
    if not ENABLE_SQLITE:
        return LogResponse(status="Ignored (SQLite Disabled)")
        
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            INSERT INTO forecast_runs (building, horizon_days, total_projected_kwh, projected_cost, projected_co2, peak_load_kwh, context_log)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (request.building, request.horizon_days, request.total_projected_kwh, request.projected_cost, request.projected_co2, request.peak_load_kwh, request.context_log))
        
        last_id = c.lastrowid
        conn.commit()
        conn.close()
        return LogResponse(status="Saved", id=last_id)
        
    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@app.get("/api/v1/logs/latest", response_model=LatestLogResponse)
def get_latest_log(building: str):
    if not ENABLE_SQLITE:
        raise HTTPException(status_code=501, detail="SQLite is disabled")
        
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row # Access columns by name
        c = conn.cursor()
        
        # Attempt to find latest audit
        c.execute("SELECT * FROM audit_runs WHERE building = ? ORDER BY created_at DESC LIMIT 1", (building,))
        audit = c.fetchone()
        
        # Attempt to find latest forecast
        c.execute("SELECT * FROM forecast_runs WHERE building = ? ORDER BY created_at DESC LIMIT 1", (building,))
        forecast = c.fetchone()
        
        conn.close()
        
        # Determine which is newer
        audit_ts = audit['created_at'] if audit else "1970-01-01"
        forecast_ts = forecast['created_at'] if forecast else "1970-01-01"
        
        if audit and (audit_ts >= forecast_ts):
            return LatestLogResponse(
                type="audit",
                timestamp=audit_ts,
                data=dict(audit)
            )
        elif forecast:
             return LatestLogResponse(
                type="forecast",
                timestamp=forecast_ts,
                data=dict(forecast)
            )
        else:
            raise HTTPException(status_code=404, detail="No logs found")

    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
