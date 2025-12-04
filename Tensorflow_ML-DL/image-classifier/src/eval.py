import os, tensorflow as tf, tensorflow_datasets as tfds

IMG = 224
BATCH = 32
DATA_DIR = os.environ.get("TFDS_DATA_DIR")
DATASET_NAME = "stanford_dogs"  # checkpoint actual
MODEL_PATH = "image-classifier/models/mobilenetv2_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)


def prep(img, label):
    img = tf.image.resize(img, (IMG, IMG))
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return img, label


ds_test, _ = tfds.load(DATASET_NAME, split="test", as_supervised=True, with_info=True, data_dir=DATA_DIR)
ds_test = ds_test.map(prep, num_parallel_calls=tf.data.AUTOTUNE).batch(BATCH).prefetch(tf.data.AUTOTUNE)
loss, acc = model.evaluate(ds_test, verbose=1)
print(f"TEST — accuracy: {acc:.4f} | loss: {loss:.4f}")
