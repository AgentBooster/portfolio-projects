import os
from pathlib import Path

os.environ.setdefault("KERAS_BACKEND", "tensorflow")

import tensorflow as tf
import keras
from data_setup import load_datasets

IMG=224
BATCH=32

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "mobilenetv2_dogs.keras"

model=keras.models.load_model(str(MODEL_PATH))

def prep(img,label):
    img=tf.image.resize(img,(IMG,IMG))
    img=keras.applications.mobilenet_v2.preprocess_input(img)
    return img,label

# Load explicit splits from centralized setup
(_, _, ds_test), _ = load_datasets()

ds_test = (ds_test
    .map(prep, num_parallel_calls=tf.data.AUTOTUNE)
    .batch(BATCH)
    .prefetch(tf.data.AUTOTUNE))

print(f"Evaluating on {ds_test.cardinality().numpy()} batches (Strict Test Set)...")
loss,acc=model.evaluate(ds_test,verbose=1)
print(f"TEST — accuracy: {acc:.4f} | loss: {loss:.4f}")
