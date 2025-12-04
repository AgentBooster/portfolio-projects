"""Simple HTTP server exposing /predict for image classification (checkpoint: dog breeds)."""

from __future__ import annotations

import io
import json
import logging
import threading
from http import HTTPStatus
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import tensorflow as tf
from PIL import Image


LOGGER = logging.getLogger("image_classifier_api")
logging.basicConfig(level=logging.INFO)


BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR.parent / "models"
MODEL_PATH = MODELS_DIR / "mobilenetv2_model.keras"
LABELS_PATH = MODELS_DIR / "labels.txt"
IMG_SIZE = 224
SERVER_ADDRESS = ("127.0.0.1", 8000)


def load_labels(path: Path) -> List[str]:
    with path.open("r", encoding="utf-8") as handle:
        labels = [line.strip() for line in handle if line.strip()]
    if not labels:
        raise RuntimeError("El archivo de etiquetas está vacío.")
    return labels


if not MODEL_PATH.exists():
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}.")

LOGGER.info("Cargando modelo desde %s", MODEL_PATH)
MODEL = tf.keras.models.load_model(str(MODEL_PATH))
LOGGER.info("Modelo cargado correctamente.")

LOGGER.info("Leyendo etiquetas desde %s", LABELS_PATH)
LABELS = load_labels(LABELS_PATH)
LOGGER.info("Se cargaron %s etiquetas.", len(LABELS))


def prepare_image(image_bytes: bytes) -> Tuple[np.ndarray, Image.Image]:
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    preview = pil_image.copy()
    resized = pil_image.resize((IMG_SIZE, IMG_SIZE))
    array = np.asarray(resized, dtype=np.float32)
    preprocessed = tf.keras.applications.mobilenet_v2.preprocess_input(array)
    batched = np.expand_dims(preprocessed, axis=0)
    return batched, preview


def run_prediction(image_bytes: bytes) -> Dict[str, object]:
    input_array, _ = prepare_image(image_bytes)
    raw = MODEL.predict(input_array, verbose=0)
    if raw.ndim != 2 or raw.shape[0] != 1:
        raise RuntimeError("Salida del modelo inesperada.")
    probabilities = tf.nn.softmax(raw[0]).numpy()

    top_indices = np.argsort(probabilities)[-5:][::-1]
    top5 = []
    for idx in top_indices:
        label = LABELS[idx] if idx < len(LABELS) else f"Etiqueta {idx}"
        top5.append({"label": label, "prob": float(probabilities[idx])})

    top1 = top5[0]
    return {"top1": top1, "top5": top5}


class PredictHandler(BaseHTTPRequestHandler):
    server_version = "ImageClassifier/1.0"

    def log_message(self, format: str, *args) -> None:  # pylint: disable=redefined-builtin
        LOGGER.info("%s - %s", self.address_string(), format % args)

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/predict":
            self.send_error(HTTPStatus.NOT_FOUND, "Ruta no encontrada.")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type.lower():
            self.send_error(
                HTTPStatus.BAD_REQUEST,
                "Se esperaba multipart/form-data con una imagen en el campo 'file'.",
            )
            return

        try:
            import cgi
            environ = {
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": content_type,
            }
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ=environ,
                keep_blank_values=True,
            )
        except Exception as exc:  # pylint: disable=broad-except
            LOGGER.exception("Error al parsear multipart: %s", exc)
            self.send_error(HTTPStatus.BAD_REQUEST, "No se pudo procesar la solicitud multipart.")
            return

        if "file" not in form:
            self.send_error(HTTPStatus.BAD_REQUEST, "Campo 'file' no encontrado.")
            return

        file_item = form["file"]
        if not getattr(file_item, "file", None):
            self.send_error(HTTPStatus.BAD_REQUEST, "El campo 'file' está vacío.")
            return

        try:
            image_bytes = file_item.file.read()
            result = run_prediction(image_bytes)
        except Exception as exc:  # pylint: disable=broad-except
            LOGGER.exception("Error ejecutando la predicción: %s", exc)
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, f"Error durante la predicción: {exc}")
            return

        payload = json.dumps(result).encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main() -> None:
    server = ThreadingHTTPServer(SERVER_ADDRESS, PredictHandler)
    LOGGER.info("Servidor iniciado en http://%s:%s", *SERVER_ADDRESS)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        LOGGER.info("Deteniendo servidor...")
    finally:
        shutdown_thread = threading.Thread(target=server.shutdown, daemon=True)
        shutdown_thread.start()
        shutdown_thread.join()


if __name__ == "__main__":
    main()
