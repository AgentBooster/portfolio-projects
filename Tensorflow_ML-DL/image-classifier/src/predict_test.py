import os, tensorflow as tf, tensorflow_datasets as tfds

IMG = 224
DATA_DIR = os.environ.get("TFDS_DATA_DIR")
DATASET_NAME = "stanford_dogs"  # checkpoint actual
MODEL_PATH = "image-classifier/models/mobilenetv2_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)
ds, info = tfds.load(DATASET_NAME, split="test", as_supervised=True, with_info=True, data_dir=DATA_DIR)
names = info.features["label"].names


def prep(img):
    img = tf.image.resize(img, (IMG, IMG))
    return tf.keras.applications.mobilenet_v2.preprocess_input(tf.cast(img, tf.float32))


for img, label in ds.take(1):
    x = tf.expand_dims(prep(img), 0)
    p = tf.nn.softmax(model.predict(x, verbose=0)[0]).numpy()
    top = int(p.argmax())
    print("GT:", names[int(label.numpy())])
    print("Top-1:", names[top], f"({p[top]:.3f})")
