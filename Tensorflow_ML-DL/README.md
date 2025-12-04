# Image Classifier Demo (TensorFlow / Keras)

Demo de clasificación de imágenes con TensorFlow/Keras y una pequeña UI web/Gradio. El checkpoint actual está entrenado para razas de perro (120 clases, Stanford Dogs), pero la arquitectura se puede reusar para otros dominios con fine-tuning.

## Estructura
- `main.py`: script de prueba TensorFlow.
- `image-classifier/src/`: scripts de entrenamiento, evaluación e inferencia local.
- `image-classifier/models/`: modelo `mobilenetv2_model.keras` y etiquetas `labels.txt`.
- `image-classifier/ui/`: UI Gradio (`app.py`) y server HTTP (`api_server.py`) + assets estáticos.

## Requisitos
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Inferencia rápida (Gradio)
```bash
python image-classifier/ui/app.py
```
Abre el enlace que imprime Gradio (por defecto http://127.0.0.1:7860/) y sube una imagen.

## API HTTP
```bash
python image-classifier/ui/api_server.py
```
POST multipart a `http://127.0.0.1:8000/predict` con el campo `file` (imagen). Responde con top-1 y top-5.

## Scripts
- `image-classifier/src/predict_local.py <imagen>`: top-1/top-5 en consola.
- `image-classifier/src/predict_test.py`: prueba rápida sobre el primer ejemplo del split test.
- `image-classifier/src/eval.py`: evalúa el checkpoint sobre el split test.
- `image-classifier/src/train.py`: fine-tuning sobre Stanford Dogs (puedes cambiar `DATASET_NAME` para otro dataset compatible en TFDS).

## Notas
- El modelo actual está entrenado en `stanford_dogs` (TFDS). Los datos no se incluyen en el repo; se descargan al correr los scripts si `TFDS_DATA_DIR` no está definido.
- Para usar otro dominio, cambia `DATASET_NAME`, ajusta `labels.txt`/`labels.json` y reentrena con `train.py`.
