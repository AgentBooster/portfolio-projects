import os
import sys
import numpy as np
import tensorflow as tf
import tensorflow_datasets as tfds
from PIL import Image

IMG = 224
DATA_DIR = os.environ.get("TFDS_DATA_DIR")
DATASET_NAME = "stanford_dogs"  # checkpoint actual
MODEL_PATH = "image-classifier/models/mobilenetv2_model.keras"

_, info = tfds.load(
    DATASET_NAME,
    split="test",
    with_info=True,
    data_dir=DATA_DIR,
    as_supervised=True,
)
names = info.features["label"].names
model = tf.keras.models.load_model(MODEL_PATH)

path = sys.argv[1]
img = Image.open(path).convert("RGB").resize((IMG, IMG))
x = np.array(img, dtype=np.float32)
x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
x = np.expand_dims(x, 0)
p = model.predict(x, verbose=0)[0]
top5 = p.argsort()[-5:][::-1]
print(f"Top1: {names[top5[0]]}: {p[top5[0]]:.3f}")
print("Top5:", [(names[i], float(f"{p[i]:.3f}")) for i in top5])
