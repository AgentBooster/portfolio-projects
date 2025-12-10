import os
from pathlib import Path

os.environ.setdefault("KERAS_BACKEND", "tensorflow")

import tensorflow as tf, tensorflow_datasets as tfds
import keras
IMG=224; BATCH=32; DATA_DIR=os.environ.get("TFDS_DATA_DIR")
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "mobilenetv2_dogs.keras"
model=keras.models.load_model(str(MODEL_PATH))
def prep(img,label):
    img=tf.image.resize(img,(IMG,IMG))
    img=keras.applications.mobilenet_v2.preprocess_input(img)
    return img,label
ds_test,_=tfds.load("stanford_dogs",split="test",as_supervised=True,with_info=True,data_dir=DATA_DIR)
ds_test=ds_test.map(prep,num_parallel_calls=tf.data.AUTOTUNE).batch(BATCH).prefetch(tf.data.AUTOTUNE)
loss,acc=model.evaluate(ds_test,verbose=1)
print(f"TEST — accuracy: {acc:.4f} | loss: {loss:.4f}")
