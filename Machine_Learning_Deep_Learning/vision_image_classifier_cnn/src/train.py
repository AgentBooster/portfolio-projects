from pathlib import Path
import os
import tensorflow as tf
from data_setup import load_datasets  # Local import

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "mobilenetv2_dogs.keras"

# Hyperparameters (CS231n Tuning)
BATCH = 32
IMG = 224
EPOCHS = 10  # Increased for real training with EarlyStopping
LEARNING_RATE = 0.001

# 1. Load Data using "Power Move" splits
(ds_train, ds_val, ds_test), ds_info = load_datasets()

# 2. Augmentation Pipeline (CS231n: RandomCrop, Flip, Rotation)
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.2),
    tf.keras.layers.RandomZoom(0.2),
])

def prep_train(img, label):
    img = tf.image.resize(img, (IMG, IMG))
    img = data_augmentation(img) # Augmentation only on Train
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return img, label

def prep_val(img, label):
    img = tf.image.resize(img, (IMG, IMG))
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return img, label

# 3. Pipeline Construction
ds_train = (ds_train
    .map(prep_train, num_parallel_calls=tf.data.AUTOTUNE)
    .shuffle(2048)
    .batch(BATCH)
    .prefetch(tf.data.AUTOTUNE))

ds_val = (ds_val
    .map(prep_val, num_parallel_calls=tf.data.AUTOTUNE)
    .batch(BATCH)
    .prefetch(tf.data.AUTOTUNE))

# Test set kept separate for final eval (src/eval.py will need update too)

MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

# 4. Model Definition
base = tf.keras.applications.MobileNetV2(
    input_shape=(IMG, IMG, 3), include_top=False, weights="imagenet"
)
base.trainable = False  # Freeze backbone

model = tf.keras.Sequential([
    base,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.2), # Regularization (CS231n)
    tf.keras.layers.Dense(ds_info.features["label"].num_classes, activation="softmax")
])

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])

# 5. Callbacks (Babysitting)
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor='val_loss', patience=3, restore_best_weights=True, verbose=1
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss', factor=0.2, patience=2, min_lr=1e-5, verbose=1
    ),
    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(MODEL_PATH), save_best_only=True, monitor='val_accuracy', verbose=1
    )
]

print("Starting training with Frozen Backbone...")
history = model.fit(
    ds_train, 
    validation_data=ds_val, 
    epochs=EPOCHS, 
    callbacks=callbacks
)

# Note: We save via checkpoint, but this ensures final state is saved too if needed
model.save(str(MODEL_PATH))
print(f"OK: Model saved to {MODEL_PATH}")
