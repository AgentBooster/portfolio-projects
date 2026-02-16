
import os
import sys
from pathlib import Path

# Fix path to include project root if running from src
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(PROJECT_ROOT / "src"))

import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from data_setup import load_datasets

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
MODEL_PATH = PROJECT_ROOT / "models" / "mobilenetv2_dogs.keras"
REPORT_DIR = PROJECT_ROOT / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

def plot_confusion_matrix(cm, class_names):
    """Plots and saves confusion matrix heatmap."""
    plt.figure(figsize=(20, 20))
    sns.heatmap(cm, annot=False, fmt='d', cmap='Blues', xticklabels=False, yticklabels=False)
    plt.title('Confusion Matrix (120 Dog Breeds)')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(REPORT_DIR / "confusion_matrix.png")
    print(f"Confusion Matrix saved to {REPORT_DIR / 'confusion_matrix.png'}")

def main():
    print(f"Loading model from {MODEL_PATH}...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Load Strict Test Set
    print("Loading Test Set (50% Split)...")
    (_, _, ds_test), ds_info = load_datasets()
    
    # Get Class Names
    class_names = ds_info.features['label'].names
    print(f"Classes: {len(class_names)}")

    # Preprocess
    def prep(img, label):
        img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
        img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
        return img, label

    ds_test = ds_test.map(prep).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    # Predict
    print("Running inference on Test Set...")
    y_true = []
    y_pred = []

    for img_batch, label_batch in ds_test:
        preds = model.predict(img_batch, verbose=0)
        y_pred.extend(np.argmax(preds, axis=1))
        y_true.extend(label_batch.numpy())

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    # Classification Report
    print("\nGenerating Classification Report...")
    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    
    # Print Top 1 Accuracy
    acc = np.mean(y_true == y_pred)
    print(f"\nFinal Test Accuracy: {acc:.4f}")

    # Save Top-N Misclassifications Analysis
    # (Optional: Logic to find which pairs are most confused)
    
    # Generate Matrix
    cm = confusion_matrix(y_true, y_pred)
    plot_confusion_matrix(cm, class_names)

    # Save textual report
    with open(REPORT_DIR / "classification_report.txt", "w") as f:
        f.write(classification_report(y_true, y_pred, target_names=class_names))
    print(f"Report saved to {REPORT_DIR / 'classification_report.txt'}")

if __name__ == "__main__":
    if "seaborn" not in sys.modules:
        # Check if seaborn is installed, if not, warn
        try:
            import seaborn
        except ImportError:
            print("Seaborn not installed. Please install it for better plots: pip install seaborn")
    
    main()
