import os
# FORCE CPU MODE AGGRESSIVELY
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import tensorflow as tf
import numpy as np
from pathlib import Path
import time

def verify_model(building_name="Edificio Apolonia"):
    print(f"--- Verifying Model Integrity for {building_name} ---")
    
    model_path = Path(f"models/{building_name}_gru.keras")
    
    if not model_path.exists():
        print(f"❌ Error: Model file not found at {model_path}")
        return
        
    print(f"📂 Found model file. Size: {model_path.stat().st_size / 1024:.2f} KB")
    
    try:
        # Load Model
        print("⏳ Loading model... (This should take < 2 seconds)")
        t0 = time.time()
        model = tf.keras.models.load_model(model_path, compile=False)
        t_load = time.time() - t0
        print(f"✅ Model Loaded Successfully in {t_load:.4f}s")
        
        # Test Inference with Dummy Data
        # Shape: (Batch=1, Seq=168, Features=11)
        print("🧪 Generatng dummy input (1, 168, 11)...")
        dummy_input = np.random.rand(1, 168, 11).astype(np.float32)
        
        print("🚀 Running prediction on dummy data...")
        t1 = time.time()
        with tf.device('/CPU:0'):
            pred = model.predict(dummy_input, verbose=0)
        t_inf = time.time() - t1
        
        print(f"✅ Prediction Successful!")
        print(f"⏱️ Inference Time: {t_inf:.4f}s")
        print(f"📊 Output Shape: {pred.shape}")
        print(f"🔢 Output Value: {pred[0][0]}")
        
    except OSError:
        print("❌ FATAL: Model file is corrupted. It cannot be opened by TensorFlow.")
    except Exception as e:
        print(f"❌ FATAL: Runtime Error during verification: {e}")

if __name__ == "__main__":
    verify_model()
