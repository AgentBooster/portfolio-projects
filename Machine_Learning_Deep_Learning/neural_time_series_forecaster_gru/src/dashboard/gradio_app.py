import os
import sys

# CRITICAL: Must be set BEFORE importing tensorflow (via core)
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import gradio as gr
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from dashboard.core import (
    load_data_core,
    load_models_core,
    run_inference_core,
    get_gemini_response,
    get_openai_response,
    run_future_forecast,
    FEATURE_COLS
)

# --- Global Data Load ---
DF, META, LOGS = load_data_core()
BUILDINGS = sorted(DF['building_name'].unique().tolist()) if DF is not None else []

# --- Logic Functions ---

def load_models_wrapper(building):
    """Loads models for the selected building."""
    if not building:
        return None, "Please select a building."
    
    models = load_models_core(building)
    status = f"Models loaded for {building}"
    if 'gru' not in models:
        status += " (GRU missing)"
    if 'ae' not in models:
        status += " (AE missing)"
        
    return models, status


# --- Global KPI Logic (Green Metric) ---

from dashboard.kpi_utils import (
    get_energy_price_vectorized,
    get_emission_factor_vectorized
)

def run_analysis(building, start_date, end_date, models, api_key):
    """
    Runs inference and generates plots/KPIs.
    Returns: [Load Plot, Anomaly Plot, KPIs Markdown, Context String]
    """
    if models is None or not building:
        return None, None, "Please load models first.", ""
        
    df_building = DF[DF['building_name'] == building].sort_values('timestamp')
    
    # Run Inference
    try:
        results = run_inference_core(building, df_building, start_date, end_date, models)
    except Exception as e:
        return None, None, f"Error during inference: {str(e)}", ""
        
    if results.empty:
        return None, None, "No data or prediction for this range.", ""
        
    # --- KPIs (Advanced Green Metric Logic) ---
    total_consumption = results['predicted_kWh'].sum()
    total_actual = results['actual_kWh'].sum()
    delta = total_actual - total_consumption 
    
    # 1. Calculate Waste per Hour (Only positive deltas count as waste)
    results['waste_kWh'] = (results['actual_kWh'] - results['predicted_kWh']).clip(lower=0)
    
    # Apply Price & CO2 Logic (Global Functions)
    results['price_uyu'] = get_energy_price_vectorized(results['timestamp'])
    results['waste_cost_uyu'] = results['waste_kWh'] * results['price_uyu']
    waste_cost_uyu = results['waste_cost_uyu'].sum()
    
    results['emission_factor'] = get_emission_factor_vectorized(results['timestamp'])
    results['waste_co2'] = results['waste_kWh'] * results['emission_factor']
    waste_co2_kg = results['waste_co2'].sum()
    
    # Check for reconstruction_error
    if 'reconstruction_error' in results.columns:
        anomalies = results[results['is_anomaly']]
        anomaly_count = len(anomalies)
        max_error = results['reconstruction_error'].max()
    else:
        anomaly_count = 0
        max_error = 0
        anomalies = pd.DataFrame()

    
    # 4. Energy Intensity (kWh/m2)
    try:
        if not META.empty:
            area = META.loc[META['building_name'] == building, 'area_m2'].values[0]
            if area > 0:
                intensity_kwh_m2 = total_actual / area
                waste_kwh_m2 = results['waste_kWh'].sum() / area
                cost_uyu_m2 = waste_cost_uyu / area
                co2_kg_m2 = waste_co2_kg / area
            else:
                intensity_kwh_m2 = 0
                waste_kwh_m2 = 0
                cost_uyu_m2 = 0
                co2_kg_m2 = 0
        else:
            intensity_kwh_m2 = 0
            waste_kwh_m2 = 0
            cost_uyu_m2 = 0
            co2_kg_m2 = 0
    except:
        intensity_kwh_m2 = 0
        waste_kwh_m2 = 0
        cost_uyu_m2 = 0
        co2_kg_m2 = 0

    kpi_md = f"""
    ### 📊 Analysis Results (Green Metric Audit)
    - **Total Forecast**: {total_consumption/1000:.2f} MWh
    - **Actual Consumption**: {total_actual/1000:.2f} MWh
    - **Net Difference**: {delta/1000:.2f} MWh
    - **Energy Intensity**: {intensity_kwh_m2:.2f} kWh/m²
    
    #### 🌍 Environmental & Economic Impact (Per m² Analysis)
    - **Total Waste Cost**: ${waste_cost_uyu:,.2f} UYU (${cost_uyu_m2:.2f}/m²)
    - **Total Waste CO₂**: {waste_co2_kg:.2f} kg ({co2_kg_m2:.4f} kg/m²)
    - **Waste Intensity**: {waste_kwh_m2:.4f} kWh/m²
    - **Anomalies Detected**: {anomaly_count}
    *Methodology: UTE GC2 Tariff (Peak/Off-Peak/Holidays) & Dynamic MIEM Factors.*
    """
    
    # --- Context for Agent (Green Metric Persona) ---
    context_str = f"""
    ROLE: You are the 'Green Metric Strategy Consultant' for UCU (Universidad Católica del Uruguay).
    OBJECTIVE: Help UCU improve its UI GreenMetric World University Ranking score by reducing energy waste and promoting sustainability.
    
    CURRENT ANALYSIS CONTEXT:
    - Building: {building}
    - Dates: {start_date} to {end_date}
    - Total Actual Cons.: {total_actual:.2f} kWh
    - Total Expected Cons.: {total_consumption:.2f} kWh
    - FINANCIAL WASTE: ${waste_cost_uyu:,.2f} UYU (Calculated using UTE GC2 Tariff: Peak $5.2, Off-Peak $2.4/$4.2).
    - ENVIRONMENTAL IMPACT: {waste_co2_kg:.2f} kg CO2 (Calculated using annual MIEM factors).
    - Anomalies Count: {anomaly_count}
    
    INSTRUCTIONS:
    1. DIAGNOSE: Connect the data (Where, When, How much) to potential causes.
    2. PROPOSE SOLUTIONS (Focus on UI GreenMetric Categories):
       - **Setting & Infrastructure**: Implementation of Smart Spaces/Classrooms to automate control.
       - **Energy & Climate Change**: Promotion of Renewable Energy sources (Solar/Wind) on campus.
       - **Education & Behavior**: Campaigns to reduce consumption (e.g., "Last one out turns off AC").
    3. QUESTION BANK (Use these to guide the user if needed):
       - "What improvements could be made to transition this building to 100% renewable energy?"
       - "How can we implement smart sensors to automatically manage HVAC in this sector?"
       - "What specific educational campaign could reduce this waste pattern?"
    4. FORMAT: Propose MICRO-PROJECTS:
       - [Action]: Specific operational/technological/behavioral change.
       - [Impact]: Est. kWh or CO2 reduction.
       - [Verification]: How to measure success.
    5. Be professional, concise, and encourage decision-making.
    6. Use ONLY the metrics provided in CURRENT ANALYSIS CONTEXT. If a number is missing (e.g., peak time), say “not provided”.
    7. Quantify impact using the actual values (waste kWh, cost UYU, CO2, anomalies). Do not invent peak hours or causes.
    8. Format is mandatory: [Action], [Impact], [Verification]. No generic bullet lists without that format.
    """
    if not anomalies.empty:
        top_anoms = anomalies.nlargest(5, 'reconstruction_error')[['timestamp', 'actual_kWh', 'reconstruction_error']]
        context_str += f"\nTop 5 Anomalies (Check these specific times!):\n{top_anoms.to_string()}"

    # --- Plots ---
    # 1. Load Profile
    fig_load = go.Figure()
    fig_load.add_trace(go.Scatter(x=results['timestamp'], y=results['actual_kWh'], 
                                  mode='lines', name='Actual', line=dict(color='cyan')))
    fig_load.add_trace(go.Scatter(x=results['timestamp'], y=results['predicted_kWh'], 
                                  mode='lines', name='Predicted', line=dict(color='orange', dash='dash')))
    fig_load.update_layout(title="Load Forecast vs Actual", template="plotly_dark", xaxis_title="Time", yaxis_title="kWh")

    # 2. Anomaly
    fig_anom = go.Figure()
    if 'reconstruction_error' in results.columns:
        thresh = models.get('threshold', 0)
        fig_anom.add_trace(go.Scatter(x=results['timestamp'], y=results['reconstruction_error'],
                                      mode='lines', name='Reconstruction Error', fill='tozeroy'))
        fig_anom.add_hline(y=thresh, line_color="red", annotation_text="Threshold")
        
        if not anomalies.empty:
            fig_anom.add_trace(go.Scatter(x=anomalies['timestamp'], y=anomalies['reconstruction_error'],
                                          mode='markers', name='Anomaly', marker=dict(color='red', size=8)))
    fig_anom.update_layout(title="Anomaly Detection", template="plotly_dark", xaxis_title="Time", yaxis_title="MSE")

    return fig_load, fig_anom, kpi_md, context_str



def chat_logic(message, history, context, api_key, provider):
    if not api_key:
        return "⚠️ Please enter your API Key in the sidebar."
    
    if not context:
        return "⚠️ Please run an analysis first to provide context for the agent."
        
    if provider == "OpenAI (GPT-4o)":
        return get_openai_response(api_key, context, message)
    else:
        return get_gemini_response(api_key, context, message)

def run_future_logic(building, horizon, models):
    if not building:
        return None, "Please select a building.", ""
    if not models:
        return None, "Please wait for models to load.", ""
        
    df_building = DF[DF['building_name'] == building].sort_values('timestamp')
    
    try:
        results, status = run_future_forecast(building, df_building, horizon, models)
        if results is None:
            return None, f"Error: {status}", ""
            
        # Plot
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=results['timestamp'], y=results['predicted_kWh'], 
                                mode='lines+markers', name='Future Forecast', line=dict(color='#00ff99', dash='dot')))
        fig.update_layout(
            title=f"Future Energy Plan: Next {horizon} Days",
            template="plotly_dark",
            xaxis_title="Time", 
            yaxis_title="Predicted consumption (kWh)"
        )
        
        
        # --- Future KPIs ---
        # Reuse Global Logic for Cost & CO2
        results['price_uyu'] = get_energy_price_vectorized(results['timestamp'])
        results['projected_cost_uyu'] = results['predicted_kWh'] * results['price_uyu']
        total_cost_uyu = results['projected_cost_uyu'].sum()

        results['emission_factor'] = get_emission_factor_vectorized(results['timestamp'])
        results['projected_co2'] = results['predicted_kWh'] * results['emission_factor']
        total_co2_kg = results['projected_co2'].sum()
        
        # Additional Metrics
        total_kwh = results['predicted_kWh'].sum()
        avg_daily_kwh = total_kwh / max(1, horizon)
        
        peak_idx = results['predicted_kWh'].idxmax()
        peak_kwh = results.loc[peak_idx, 'predicted_kWh']
        peak_time = results.loc[peak_idx, 'timestamp']
        
        
        # Energy Intensity
        try:
            if not META.empty:
                area = META.loc[META['building_name'] == building, 'area_m2'].values[0]
                if area > 0:
                    proj_intensity = total_kwh / area
                    proj_cost_m2 = total_cost_uyu / area
                    proj_co2_m2 = total_co2_kg / area
                else:
                    proj_intensity = 0
                    proj_cost_m2 = 0
                    proj_co2_m2 = 0
            else:
                proj_intensity = 0
                proj_cost_m2 = 0
                proj_co2_m2 = 0
        except:
            proj_intensity = 0
            proj_cost_m2 = 0
            proj_co2_m2 = 0

        md = f"""
        ### 🔮 Plan Summary (Green Metric Projection)
        - **Horizon**: {horizon} Days ({len(results)} hours)
        - **Projected Consumption**: {total_kwh/1000:.2f} MWh
        - **Projected Intensity**: {proj_intensity:.2f} kWh/m²
        
        #### 🌍 Est. Impact (Normalized)
        - **Projected Cost**: ${total_cost_uyu:,.2f} UYU (${proj_cost_m2:.2f}/m²)
        - **Projected Footprint**: {total_co2_kg:.2f} kg CO₂ eq ({proj_co2_m2:.4f} kg/m²)
        
        #### 📈 Operational Insights
        - **Avg Daily Consumption**: {avg_daily_kwh:.2f} kWh/day
        - **Predicted Peak**: {peak_kwh:.2f} kWh at {peak_time.strftime('%Y-%m-%d %H:%M')}
        - **Status**: calculated using autoregressive GRU projection.
        """
        
        # Context for Agent
        context_str = f"""
        Future Forecast Context (Generated Plan):
        Building: {building}
        Horizon: {horizon} days
        Projected Consumption: {total_kwh:.2f} kWh
        Projected Intensity: {proj_intensity:.2f} kWh/m2
        Projected Cost: ${total_cost_uyu:,.2f} UYU
        Projected CO2: {total_co2_kg:.2f} kg
        Avg Daily: {avg_daily_kwh:.2f} kWh
        Peak Load: {peak_kwh:.2f} kWh at {peak_time}
        Status: Valid Autoregressive Projection.
        """
        
        return fig, md, context_str
        
    except Exception as e:
        return None, f"Error: {str(e)}", ""

# --- GUI ---

with gr.Blocks(title="UCU Energy Manager") as app:
    # State
    models_state = gr.State(None)
    context_state = gr.State("")

    gr.Markdown("# ⚡ UCU Campus Energy Manager (Gradio)")
    
    with gr.Row():
        # Sidebar-like Column
        with gr.Column(scale=1, min_width=300):
            gr.Markdown("### ⚙️ Configuration")
            
            building_dd = gr.Dropdown(choices=BUILDINGS, label="Select Building", value=BUILDINGS[0] if BUILDINGS else None)
            load_status = gr.Textbox(label="Model Status", interactive=False)
            
            # Date Range (Using Textbox for simplicity/robustness as Gradio date range can be finicky)
            start_txt = gr.Textbox(label="Start Date (YYYY-MM-DD)", value="2024-02-01")
            end_txt = gr.Textbox(label="End Date (YYYY-MM-DD)", value="2024-02-07")
            
            # AI Provider Selection
            provider_dd = gr.Dropdown(
                choices=["Gemini 2.0 Flash", "OpenAI (GPT-4o)"], 
                value="Gemini 2.0 Flash", 
                label="AI Consultant Provider"
            )
            api_key = gr.Textbox(label="API Key (Gemini or OpenAI)", type="password", placeholder="Enter key...")
            
            analyze_btn = gr.Button("🚀 Run Analysis", variant="primary")
            
        # Main Content
        with gr.Column(scale=4):
            with gr.Tabs():
                with gr.Tab("📊 Dashboard"):
                    kpi_display = gr.Markdown("### Waiting for analysis...")
                    plot_load = gr.Plot(label="Load Profile")
                    plot_anom = gr.Plot(label="Anomaly Detection")
                
                with gr.Tab("🔮 Future Planning"):
                    gr.Markdown("### Autoregressive Future Projection")
                    gr.Markdown("Projects consumption into the future (beyond available data) using the GRU model recursively.")
                    
                    with gr.Row():
                        horizon_slider = gr.Slider(minimum=1, maximum=30, value=7, step=1, label="Forecast Horizon (Days)")
                        future_btn = gr.Button("🔮 Generate Plan")
                    
                    future_plot = gr.Plot(label="Future Projection")
                    future_md = gr.Markdown()

                with gr.Tab("🤖 Virtual Consultant"):
                    chatbot = gr.Chatbot(height=400) # Reverted: type="messages" not supported in this version
                    msg = gr.Textbox(label="Ask the Consultant")
                    clear = gr.Button("Clear")

    # --- Events ---
    
    # Load Models on Building Change
    building_dd.change(
        fn=load_models_wrapper,
        inputs=[building_dd],
        outputs=[models_state, load_status]
    )
    
    # Run Analysis
    analyze_btn.click(
        fn=run_analysis,
        inputs=[building_dd, start_txt, end_txt, models_state, api_key],
        outputs=[plot_load, plot_anom, kpi_display, context_state]
    )
    
    # Run Future Forecast (Updated to output context)
    future_btn.click(
        fn=run_future_logic,
        inputs=[building_dd, horizon_slider, models_state],
        outputs=[future_plot, future_md, context_state]
    )
    
    # Chat
    def respond(message, chat_history, context, key, provider):
        if chat_history is None:
            chat_history = []
        bot_message = chat_logic(message, chat_history, context, key, provider)

        # Using dict format {"role": ..., "content": ...} as expected by this Gradio version
        chat_history.append({"role": "user", "content": message})
        chat_history.append({"role": "assistant", "content": bot_message})
        return "", chat_history

    msg.submit(respond, [msg, chatbot, context_state, api_key, provider_dd], [msg, chatbot])
    
    # Clear Chat
    clear.click(lambda: ([], ""), None, [chatbot, context_state], queue=False)

# Launch
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.launch(server_name="0.0.0.0", server_port=port, theme=gr.themes.Base())
