"""Gradio interface for an image classifier demo (checkpoint: dog breeds)."""

from pathlib import Path
from typing import List, Sequence, Tuple

import numpy as np
import tensorflow as tf
from PIL import Image
import gradio as gr


IMG_SIZE = 224
APP_DIR = Path(__file__).resolve().parent
MODELS_DIR = APP_DIR.parent / "models"
MODEL_PATH = MODELS_DIR / "mobilenetv2_model.keras"
LABELS_PATH = MODELS_DIR / "labels.txt"


def _load_labels(path: Path) -> List[str]:
    """Read label file and return non-empty trimmed entries."""
    try:
        with path.open("r", encoding="utf-8") as handle:
            labels = [line.strip() for line in handle if line.strip()]
    except OSError as exc:
        raise RuntimeError(f"No se pudo cargar el archivo de etiquetas: {exc}") from exc

    if not labels:
        raise RuntimeError("El archivo de etiquetas está vacío.")

    return labels


if not MODEL_PATH.exists():
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}.")

MODEL = tf.keras.models.load_model(str(MODEL_PATH))
LABELS = _load_labels(LABELS_PATH)


def _preprocess(image: Image.Image) -> Tuple[np.ndarray, Image.Image]:
    """Convert image to RGB, resize to target size and return array + preview copy."""
    rgb_image = image.convert("RGB")
    preview_image = rgb_image.copy()
    resized = rgb_image.resize((IMG_SIZE, IMG_SIZE))
    array = np.asarray(resized, dtype=np.float32)
    preprocessed = tf.keras.applications.mobilenet_v2.preprocess_input(array)
    batched = np.expand_dims(preprocessed, axis=0)
    return batched, preview_image


def _format_topk(indices: Sequence[int], probabilities: np.ndarray) -> str:
    """Format top-k predictions with label names and probabilities."""
    lines = []
    for rank, index in enumerate(indices, start=1):
        if index < len(LABELS):
            label = LABELS[index]
        else:
            label = f"Etiqueta {index}"
        prob = probabilities[index]
        lines.append(f"{rank}. {label} ({prob:.3f})")
    return "\n".join(lines)


def predict(image: Image.Image) -> Tuple[Image.Image, str, str]:
    """Run prediction pipeline and return preview, top-1 text, top-5 list."""
    if image is None:
        return (
            None,
            "Error: no se recibió ninguna imagen.",
            "",
        )

    try:
        input_array, preview_image = _preprocess(image)
        raw_predictions = MODEL.predict(input_array, verbose=0)
        if raw_predictions.ndim != 2 or raw_predictions.shape[0] != 1:
            raise RuntimeError("El modelo devolvió una salida inesperada.")

        probabilities = tf.nn.softmax(raw_predictions[0]).numpy()
        top_indices = np.argsort(probabilities)[-5:][::-1]
        top1_index = top_indices[0]
        top1_label = LABELS[top1_index] if top1_index < len(LABELS) else f"Etiqueta {top1_index}"
        top1_prob = probabilities[top1_index]

        top5_text = _format_topk(top_indices, probabilities)
        top1_text = f"{top1_label} ({top1_prob:.3f})"

        return preview_image, top1_text, top5_text
    except Exception as exc:  # pylint: disable=broad-exception-caught
        return (
            None,
            f"Error: {exc}",
            "",
        )


iface = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="pil", label="Imagen (drag-and-drop)"),
    outputs=[
        gr.Image(type="pil", label="Imagen"),
        gr.Textbox(label="Top-1"),
        gr.Textbox(label="Top-5"),
    ],
    title="Demo de Clasificación de Imágenes",
    description=(
        "Carga una imagen para predecir su clase usando MobileNetV2. "
        "Checkpoint actual: razas de perro (120 clases, Stanford Dogs). "
        "La imagen se convierte a RGB y 224×224 antes de la inferencia."
    ),
)


def main() -> None:
    """Launch Gradio application."""
    iface.launch()


if __name__ == "__main__":
    main()
