# Vision Image Classifier CNN

Clasificador de razas de perros basado en **MobileNetV2** (TensorFlow / Keras) con múltiples rutas de inferencia: scripts de consola, un servidor HTTP ligero, una interfaz web en Gradio y un cliente estático que consume la API o un modelo TensorFlow.js.

## Características principales
- **Entrenamiento reproducible** con TensorFlow Datasets usando `stanford_dogs`, preprocesamiento MobileNetV2 y congelamiento del backbone (`src/train.py`).
- **Artefactos listos para producción**: `models/mobilenetv2_dogs.keras` y `models/labels.txt`, además de `ui/static/labels.json` para la UI.
- **Herramientas de inferencia**:
  - CLI para evaluar datasets (`src/eval.py`), probar el split de test (`src/predict_test.py`) o clasificar imágenes locales (`src/predict_local.py`).
  - Servidor REST `/predict` (`ui/api_server.py`) que devuelve Top‑1/Top‑5 en JSON.
  - Interfaz Gradio (`ui/app.py`) para pruebas rápidas.
  - Cliente web estático (`ui/index.html` + `static/`) con drag‑and‑drop y copia de resultados, que usa la API por defecto y puede usar un modelo TF.js si se añade `ui/static/web_model/`.
- **Front‑end moderno** con feedback en tiempo real, barra de progreso, accesibilidad básica y opción de copiar los resultados Top‑5.

## Estructura del proyecto
```
vision_image_classifier_cnn/
├── src/                 # Entrenamiento y scripts de inferencia (TensorFlow/Keras)
├── ui/
│   ├── api_server.py    # Servidor HTTP con /predict (multipart/form-data, JSON Top-5)
│   ├── app.py           # Interfaz Gradio
│   ├── index.html       # Cliente estático (drag & drop)
│   └── static/          # JS, CSS y labels.json usados por la UI
├── models/
│   ├── mobilenetv2_dogs.keras  # Modelo entrenado
│   └── labels.txt              # Etiquetas (una por línea)
├── data/, images/, flagged/    # Recursos auxiliares y muestras
├── requirements.txt     # Dependencias principales
├── venv_tf/             # (Opcional) entorno virtual local
└── colab_setup.ipynb    # Notebook auxiliar para entrenamiento remoto
```

## Requisitos
- Python **3.9+**.
- `pip` y `virtualenv`/`venv`.
- macOS con TensorFlow-macos 2.15 ya configurado (u otra plataforma compatible).
- `tensorflow-datasets` y el resto de dependencias listadas en `requirements.txt`.
- (Opcional) `TFDS_DATA_DIR` para reutilizar datasets descargados de TensorFlow Datasets.

Instala las dependencias en un entorno virtual:
```bash
python3 -m venv venv_tf
source venv_tf/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Dataset
Se utiliza `stanford_dogs` desde **TensorFlow Datasets** (instalado vía `requirements.txt`). Los scripts descargarán los shards automáticamente en la primera ejecución. Para guardar los datos en una ruta personalizada, define:

```bash
export TFDS_DATA_DIR=/ruta/a/tus/datasets
```

## Entrenamiento
`src/train.py` descarga el dataset, aplica `tf.keras.applications.mobilenet_v2.preprocess_input`, congela MobileNetV2 como backbone y entrena la capa densa final (softmax) durante 3 épocas. El modelo y las etiquetas se escriben en `models/mobilenetv2_dogs.keras` y `models/labels.txt`.

```bash
source venv_tf/bin/activate
python3 src/train.py
```

> **Nota:** Ajusta `BATCH`, `IMG`, `EPOCHS` o la ruta de salida editando las constantes al inicio del script.

## Evaluación y pruebas rápidas
| Script | Uso | Descripción |
|--------|-----|-------------|
| `python3 src/eval.py` | Evalúa el split de test completo | Reporta `accuracy` y `loss` promedio. |
| `python3 src/predict_test.py` | Smoke test | Toma una muestra del split `test` y muestra la predicción Top‑1. |
| `python3 src/predict_local.py path/a/imagen.jpg` | Inferencia en imágenes locales | Imprime Top‑1 y Top‑5 para archivos individuales. |

## Opciones de inferencia / serving

### 1. Servidor REST (`ui/api_server.py`)
```bash
source venv_tf/bin/activate
python3 ui/api_server.py
```
- Expone `POST /predict` en `http://127.0.0.1:8000`.
- Acepta `multipart/form-data` con el archivo en el campo `file`.
- Responde JSON con:
  ```json
  { "top1": {"label": "...", "prob": 0.97}, "top5": [{"label": "...", "prob": 0.97}, ...] }
  ```
- Añade headers CORS sencillos para poder llamar desde el cliente web.

### 2. Interfaz Gradio (`ui/app.py`)
```bash
source venv_tf/bin/activate
python3 ui/app.py
```
Gradio abrirá, por defecto, `http://127.0.0.1:7860`. Puedes habilitar un enlace público pasando `share=True` dentro de `iface.launch()` si lo necesitas.

### 3. Cliente web estático (`ui/index.html`)
El front-end `ui/index.html` junto con `ui/static/` ofrece:
- Arrastrar y soltar o seleccionar imágenes.
- Vista previa, barra de progreso y mensajes accesibles.
- Resultados Top‑1 y Top‑5 con opción de copiar al portapapeles.
- Fallback a TensorFlow.js si se agrega un modelo en `ui/static/web_model/model.json`; de lo contrario usa la API REST configurada en `ui/static/app.js` (`API_URL` por defecto `http://127.0.0.1:8000/predict`).

Para servirlo localmente:
```bash
cd ui
python3 -m http.server 8080
```
Luego abre `http://127.0.0.1:8080` y asegúrate de que el API server esté corriendo en paralelo.

## Modelos y etiquetas
- `models/mobilenetv2_dogs.keras`: pesos del modelo listos para `keras.models.load_model`.
- `models/labels.txt`: etiquetas utilizadas por la API y Gradio.
- `ui/static/labels.json`: la misma lista en formato JSON para el cliente web. Si vuelves a entrenar o cambias de dataset, actualiza ambos archivos para mantener la consistencia (por ejemplo):
  ```bash
  python3 - <<'PY'
  import json
  from pathlib import Path
  labels = [line.strip() for line in Path("models/labels.txt").read_text().splitlines() if line.strip()]
  Path("ui/static/labels.json").write_text(json.dumps(labels, indent=2) + "\n")
  PY
  ```

## Scripts auxiliares
- `main.py`: realiza una multiplicación de tensores grande para comprobar que TensorFlow esté correctamente instalado.
- `colab_setup.ipynb`: flujo alternativo para preparar el entorno en Google Colab.

## Buenas prácticas operativas
- Define `KERAS_BACKEND=tensorflow` si necesitas forzar el backend (los scripts ya lo hacen cuando corresponde).
- Vuelve a crear `venv_tf` si mueves el proyecto de carpeta; los shebangs guardan rutas absolutas.
- Utiliza `TFDS_DATA_DIR` para evitar descargar de nuevo los datos al entrenar en distintas máquinas.
- Mantén `requirements.txt` sincronizado cuando actualices versiones (Gradio, TensorFlow, etc.).

## Demo en LinkedIn
Documenté una prueba rápida en video dentro de esta publicación:  
[Hoy entrené un modelo de Machine Learning…](https://www.linkedin.com/posts/christian-moraes-pedrozo-24702a307_hoy-entren%C3%A9-un-modelo-de-machine-learning-activity-7392105317498515456-VMBG)  
Ahí se ve el flujo de carga de imágenes en la UI y la respuesta del modelo en vivo.

Con este README el proyecto queda documentado para desarrolladores y operadores: puedes entrenar, evaluar, servir y probar la clasificación de razas caninas desde el mismo repositorio.
