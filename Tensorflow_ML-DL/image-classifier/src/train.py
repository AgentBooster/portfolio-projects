import tensorflow as tf
import tensorflow_datasets as tfds

BATCH = 32
IMG = 224
EPOCHS = 3
MODEL_PATH = "image-classifier/models/mobilenetv2_model.keras"
# Checkpoint actual entrenado en Stanford Dogs (120 clases).
DATASET_NAME = "stanford_dogs"

(ds_train, ds_val), ds_info = tfds.load(
    DATASET_NAME, split=["train", "test"], with_info=True, as_supervised=True
)


def prep(img, label):
    img = tf.image.resize(img, (IMG, IMG))
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return img, label


ds_train = (
    ds_train.map(prep, num_parallel_calls=tf.data.AUTOTUNE)
    .shuffle(2048)
    .batch(BATCH)
    .prefetch(tf.data.AUTOTUNE)
)

ds_val = (
    ds_val.map(prep, num_parallel_calls=tf.data.AUTOTUNE)
    .batch(BATCH)
    .prefetch(tf.data.AUTOTUNE)
)

base = tf.keras.applications.MobileNetV2(
    input_shape=(IMG, IMG, 3), include_top=False, weights="imagenet"
)
base.trainable = False

model = tf.keras.Sequential(
    [
        base,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(ds_info.features["label"].num_classes, activation="softmax"),
    ]
)

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

model.fit(ds_train, validation_data=ds_val, epochs=EPOCHS)
model.save(MODEL_PATH)
print(f"OK: modelo guardado en {MODEL_PATH}")
