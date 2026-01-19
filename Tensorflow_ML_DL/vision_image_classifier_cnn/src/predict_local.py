import os, sys
from pathlib import Path

os.environ.setdefault("KERAS_BACKEND", "tensorflow")

import numpy as np, tensorflow as tf, tensorflow_datasets as tfds
import keras
from PIL import Image
IMG=224
DATA_DIR=os.environ.get("TFDS_DATA_DIR")
_, info=tfds.load("stanford_dogs",split="test",with_info=True,data_dir=DATA_DIR,as_supervised=True)
names=info.features["label"].names
PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "mobilenetv2_dogs.keras"
model=keras.models.load_model(str(MODEL_PATH))
path=sys.argv[1]
img=Image.open(path).convert("RGB").resize((IMG,IMG))
x=np.array(img).astype(np.float32)
x=keras.applications.mobilenet_v2.preprocess_input(x)
x=np.expand_dims(x,0)
p=model.predict(x,verbose=0)[0]
top5=p.argsort()[-5:][::-1]
print(f"Top1: {names[top5[0]]}: {p[top5[0]]:.3f}")
print("Top5:",[(names[i],float(f"{p[i]:.3f}")) for i in top5])
