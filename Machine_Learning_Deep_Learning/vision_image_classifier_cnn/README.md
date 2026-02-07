# Vision Image Classifier CNN

Dog breed classifier based on **MobileNetV2** (TensorFlow / Keras) with multiple
inference paths: CLI scripts, a lightweight HTTP server, a Gradio web UI, and a
static client that consumes the API or a TensorFlow.js model.

## Key features
- **Reproducible training** with TensorFlow Datasets using `stanford_dogs`,
  MobileNetV2 preprocessing, and backbone freezing (`src/train.py`).
- **Production-ready artifacts**: `models/mobilenetv2_dogs.keras` and
  `models/labels.txt`, plus `ui/static/labels.json` for the UI.
- **Inference tools**:
  - CLI to evaluate datasets (`src/eval.py`), test the `test` split
    (`src/predict_test.py`), or classify local images (`src/predict_local.py`).
  - REST server `/predict` (`ui/api_server.py`) that returns Top-1/Top-5 in JSON.
  - Gradio UI (`ui/app.py`) for quick tests.
  - Static web client (`ui/index.html` + `static/`) with drag-and-drop and copyable
    results. It uses the API by default and can use a TF.js model if
    `ui/static/web_model/` is added.
- **Modern front end** with real-time feedback, progress bar, basic accessibility,
  and a Top-5 copy option.

## Project structure
```
vision_image_classifier_cnn/
├── src/                 # Training and inference scripts (TensorFlow/Keras)
├── ui/
│   ├── api_server.py    # HTTP server with /predict (multipart/form-data, JSON Top-5)
│   ├── app.py           # Gradio UI
│   ├── index.html       # Static client (drag & drop)
│   └── static/          # JS, CSS, and labels.json used by the UI
├── models/
│   ├── mobilenetv2_dogs.keras  # Trained model
│   └── labels.txt              # Labels (one per line)
├── data/, images/, flagged/    # Helper resources and samples
├── requirements.txt     # Main dependencies
├── venv_tf/             # (Optional) local virtual env
└── colab_setup.ipynb    # Helper notebook for remote training
```

## Requirements
- Python **3.11** recommended (TensorFlow wheels are version-specific).
- `pip` and `virtualenv`/`venv`.
- `tensorflow` + `keras` (Keras 3) and the other dependencies listed in `requirements.txt`.
- (Optional) `TFDS_DATA_DIR` to reuse downloaded TensorFlow Datasets.

Install dependencies in a virtual environment (macOS):
```bash
python3.11 -m venv venv_tf
source venv_tf/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

On Apple Silicon, you can add GPU acceleration with:
```bash
pip install tensorflow-metal
```

Windows (CPU):
```bash
python -m venv venv_tf
venv_tf\\Scripts\\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## Dataset
Uses `stanford_dogs` from **TensorFlow Datasets** (installed via
`requirements.txt`). The scripts will download the shards automatically on the
first run. To store data in a custom path, set:

```bash
export TFDS_DATA_DIR=/path/to/your/datasets
```

## Training
`src/train.py` downloads the dataset, applies
`tf.keras.applications.mobilenet_v2.preprocess_input`, freezes MobileNetV2 as a
backbone, and trains the final dense layer (softmax) for 3 epochs. The model and
labels are written to `models/mobilenetv2_dogs.keras` and `models/labels.txt`.

```bash
source venv_tf/bin/activate
python3 src/train.py
```

> **Note:** Adjust `BATCH`, `IMG`, `EPOCHS`, or the output path by editing the
> constants at the top of the script.

## Evaluation and quick tests
| Script | Usage | Description |
|--------|-----|-------------|
| `python3 src/eval.py` | Evaluates the full test split | Reports average `accuracy` and `loss`. |
| `python3 src/predict_test.py` | Smoke test | Takes one sample from the `test` split and prints the Top-1 prediction. |
| `python3 src/predict_local.py path/to/image.jpg` | Local image inference | Prints Top-1 and Top-5 for individual files. |

## Inference / serving options

### 1. REST server (`ui/api_server.py`)
```bash
source venv_tf/bin/activate
python3 ui/api_server.py
```
- Exposes `POST /predict` at `http://127.0.0.1:8000`.
- Accepts `multipart/form-data` with the file in the `file` field.
- Returns JSON with:
  ```json
  { "top1": {"label": "...", "prob": 0.97}, "top5": [{"label": "...", "prob": 0.97}, ...] }
  ```
- Adds simple CORS headers so the web client can call it.

### 2. Gradio UI (`ui/app.py`)
```bash
source venv_tf/bin/activate
python3 ui/app.py
```
By default, Gradio opens `http://127.0.0.1:7860`. You can enable a public link
by passing `share=True` inside `iface.launch()` if needed.

### 3. Static web client (`ui/index.html`)
The front end `ui/index.html` together with `ui/static/` offers:
- Drag and drop or select images.
- Preview, progress bar, and accessible messages.
- Top-1 and Top-5 results with a copy-to-clipboard option.
- Fallback to TensorFlow.js if a model is added in
  `ui/static/web_model/model.json`; otherwise it uses the REST API configured in
  `ui/static/app.js` (`API_URL` defaults to `http://127.0.0.1:8000/predict`).

To serve it locally:
```bash
cd ui
python3 -m http.server 8080
```
Then open `http://127.0.0.1:8080` and make sure the API server is running in
parallel.

## Models and labels
- `models/mobilenetv2_dogs.keras`: model weights ready for `keras.models.load_model`.
- `models/labels.txt`: labels used by the API and Gradio.
- `ui/static/labels.json`: the same list in JSON format for the web client. If
  you retrain or change the dataset, update both files to keep consistency
  (for example):
  ```bash
  python3 - <<'PY'
  import json
  from pathlib import Path
  labels = [line.strip() for line in Path("models/labels.txt").read_text().splitlines() if line.strip()]
  Path("ui/static/labels.json").write_text(json.dumps(labels, indent=2) + "\n")
  PY
  ```

## Helper scripts
- `main.py`: performs a large tensor multiplication to verify that TensorFlow
  is installed correctly.
- `colab_setup.ipynb`: alternate flow to prepare the environment in Google Colab.

## Operational best practices
- Define `KERAS_BACKEND=tensorflow` if you need to force the backend (the scripts
  already do this when needed).
- Recreate `venv_tf` if you move the project folder; the shebangs store absolute paths.
- Use `TFDS_DATA_DIR` to avoid re-downloading data when training across machines.
- Keep `requirements.txt` in sync when you update versions (Gradio, TensorFlow, etc.).

## LinkedIn demo
I documented a quick video test in this post:
[Today I trained a Machine Learning model...](https://www.linkedin.com/posts/christian-moraes-pedrozo-24702a307_hoy-entren%C3%A9-un-modelo-de-machine-learning-activity-7392105317498515456-VMBG)
It shows the image upload flow in the UI and the live model response.

With this README, the project is documented for developers and operators: you can
train, evaluate, serve, and test dog breed classification from the same repo.
