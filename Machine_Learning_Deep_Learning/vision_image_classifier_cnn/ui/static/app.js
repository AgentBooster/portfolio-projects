const API_URL = "http://127.0.0.1:8080/predict";
const IMG_SIZE = 224;
const DEFAULT_DROP_TEXT = "Drag your image here or click to select.";

let labels = [];
let backendMode = "api"; // "api" | "tfjs"
let tfModel = null;
let currentFile = null;
let latestResultsSummary = "";
let dragCounter = 0;

const statusTypes = {
  info: "status--info",
  success: "status--success",
  error: "status--error"
};

const dom = {};

window.addEventListener("DOMContentLoaded", () => {
  dom.dropZone = document.getElementById("drop-zone");
  dom.dropText = document.getElementById("drop-text");
  dom.fileInput = document.getElementById("file-input");
  dom.previewImage = document.getElementById("preview-image");
  dom.predictButton = document.getElementById("predict-button");
  dom.copyButton = document.getElementById("copy-button");
  dom.progress = document.getElementById("progress");
  dom.status = document.getElementById("status");
  dom.top1 = document.getElementById("top1");
  dom.top5Body = document.getElementById("top5-body");
  dom.resultsContainer = document.getElementById("results-container");

  attachEventListeners();
  initialize();
});

function attachEventListeners() {
  dom.dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dom.fileInput.click();
    }
  });

  dom.dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  });

  dom.dropZone.addEventListener("dragenter", (event) => {
    event.preventDefault();
    dragCounter += 1;
    dom.dropZone.classList.add("drop-zone--over");
  });

  dom.dropZone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    const related = event.relatedTarget;
    if (!related || !dom.dropZone.contains(related)) {
      dragCounter = Math.max(0, dragCounter - 1);
      if (dragCounter === 0) {
        dom.dropZone.classList.remove("drop-zone--over");
      }
    }
  });

  dom.dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dragCounter = 0;
    dom.dropZone.classList.remove("drop-zone--over");
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      handleFile(file);
    } else {
      clearSelection();
    }
  });

  dom.fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    } else {
      clearSelection();
    }
    event.target.value = "";
  });

  dom.predictButton.addEventListener("click", () => {
    void runInference();
  });

  dom.copyButton.addEventListener("click", () => {
    void copyResults();
  });
}

async function initialize() {
  setStatus("Preparing application...", "info");
  try {
    labels = await loadLabels();
  } catch (error) {
    setStatus(`Could not load labels: ${error.message || error}`, "error");
    return;
  }

  try {
    const mode = await detectBackend();
    backendMode = mode;
    setStatus("Ready to process images.", "success");
  } catch (error) {
    console.error(error);
    setStatus("Ready to process images.", "info");
    backendMode = "api";
  }
}

async function loadLabels() {
  const response = await fetch("static/labels.json");
  if (!response.ok) {
    throw new Error(`could not load labels (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("label file is invalid or empty");
  }
  return data;
}

async function detectBackend() {
  if (typeof window.tf === "undefined") {
    return "api";
  }
  try {
    await tf.ready();
  } catch (error) {
    console.warn("tf.ready() failed, using REST API.", error);
    return "api";
  }

  const webModelUrl = "./web_model/model.json";
  const hasLocalModel = await resourceExists(webModelUrl);
  if (!hasLocalModel) {
    return "api";
  }

  try {
    tfModel = await loadTfModel(webModelUrl);
    if (tfModel) {
      return "tfjs";
    }
  } catch (error) {
    console.warn("Could not load a local TF.js model:", error);
  }
  return "api";
}

async function loadTfModel(url) {
  try {
    return await tf.loadLayersModel(url);
  } catch (layersError) {
    console.warn("Carga como LayersModel fallida, intentando GraphModel.", layersError);
    try {
      return await tf.loadGraphModel(url);
    } catch (graphError) {
      console.warn("Carga como GraphModel fallida.", graphError);
      throw graphError;
    }
  }
}

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    setStatus("Error: the selected file is not an image.", "error");
    clearSelection();
    return;
  }

  currentFile = file;
  resetResults();
  dom.dropText.textContent = file.name;
  dom.previewImage.hidden = true;

  const reader = new FileReader();
  reader.onload = () => {
    dom.previewImage.src = reader.result;
    dom.previewImage.hidden = false;
  };
  reader.onerror = () => {
    console.error("Error reading the selected image.", reader.error);
    setStatus("Could not read the selected image. Try another file.", "error");
    clearSelection();
  };
  reader.readAsDataURL(file);
}

function resetResults() {
  dom.top1.textContent = "";
  dom.top5Body.innerHTML = "";
  dom.copyButton.disabled = true;
  latestResultsSummary = "";
  if (dom.resultsContainer) {
    dom.resultsContainer.classList.add("hidden");
  }
}

async function runInference() {
  if (!currentFile) {
    setStatus("Select or drag an image before running inference.", "error");
    return;
  }

  showProgress(true);
  dom.predictButton.disabled = true;
  setStatus("Processing image...", "info");

  try {
    let results;
    if (backendMode === "tfjs" && tfModel) {
      const probabilities = await runTfjsInference(currentFile);
      results = buildResultsFromProbabilities(probabilities);
      setStatus("Prediction ready.", "success");
    } else {
      results = await runApiInference(currentFile);
      setStatus("Prediction completed.", "success");
    }
    renderResults(results.top1, results.top5);
  } catch (error) {
    console.error(error);
    setStatus("We could not process the image. Try again.", "error");
  } finally {
    showProgress(false);
    dom.predictButton.disabled = false;
  }
}

async function runTfjsInference(file) {
  let bitmap;
  let normalized;
  let logitsTensor;
  try {
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(file);
      normalized = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(bitmap).toFloat();
        const resized = tf.image.resizeBilinear(tensor, [IMG_SIZE, IMG_SIZE], true);
        const scaled = resized.div(255);
        return scaled.expandDims(0);
      });
      if (bitmap.close) {
        bitmap.close();
      }
    } else {
      await ensureImageReady(dom.previewImage);
      normalized = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(dom.previewImage).toFloat();
        const resized = tf.image.resizeBilinear(tensor, [IMG_SIZE, IMG_SIZE], true);
        const scaled = resized.div(255);
        return scaled.expandDims(0);
      });
    }

    let logits = tfModel.predict ? tfModel.predict(normalized) : null;
    if (logits instanceof Promise) {
      logits = await logits;
    }

    if (!logits && typeof tfModel.executeAsync === "function") {
      logits = await tfModel.executeAsync(normalized);
    } else if (!logits && typeof tfModel.execute === "function") {
      logits = tfModel.execute(normalized);
    }

    if (Array.isArray(logits)) {
      logitsTensor = logits[0];
      logits.slice(1).forEach(disposeTensor);
    } else {
      logitsTensor = logits;
    }
    if (!logitsTensor || typeof logitsTensor.data !== "function") {
      throw new Error("The TF.js model returned an invalid output.");
    }

    const probabilitiesTensor = tf.softmax(logitsTensor);
    const probabilities = Array.from(await probabilitiesTensor.data());

    disposeTensor(probabilitiesTensor);

    return probabilities;
  } finally {
    if (bitmap && bitmap.close) {
      bitmap.close();
    }
    disposeTensor(logitsTensor);
    disposeTensor(normalized);
  }
}

async function runApiInference(file) {
  const formData = new FormData();
  formData.append("file", file, file.name || "upload.jpg");

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorText = await safeReadText(response);
    throw new Error(`the API returned ${response.status}: ${errorText || response.statusText}`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("the API response is not valid JSON");
  }

  if (!payload?.top1 || !payload?.top5) {
    throw new Error("the API response is incomplete");
  }

  return {
    top1: normalizePrediction(payload.top1),
    top5: Array.isArray(payload.top5) ? payload.top5.map(normalizePrediction) : []
  };
}

function normalizePrediction(item) {
  if (!item) {
    return { label: "Unknown", prob: 0 };
  }
  const label = typeof item.label === "string" ? item.label : "Unknown";
  const prob = Number.isFinite(Number(item.prob)) ? Number(item.prob) : 0;
  return { label, prob };
}

function buildResultsFromProbabilities(probabilities) {
  if (!Array.isArray(probabilities) || probabilities.length === 0) {
    throw new Error("The model result is empty.");
  }
  if (!Array.isArray(labels) || labels.length === 0) {
    throw new Error("No labels available to map predictions.");
  }
  const entries = probabilities.map((prob, index) => ({
    label: labels[index] || `Label ${index}`,
    prob: Number(prob)
  }));
  const sorted = entries.sort((a, b) => b.prob - a.prob);
  const top5 = sorted.slice(0, 5);
  const top1 = top5[0] || { label: "No result", prob: 0 };
  return { top1, top5 };
}

function renderResults(top1, top5) {
  dom.top1.textContent = `${top1.label} (${formatProbability(top1.prob)})`;
  dom.top5Body.innerHTML = top5
    .map((entry, idx) => {
      return `<tr><td>${idx + 1}</td><td>${entry.label}</td><td>${formatProbability(entry.prob)}</td></tr>`;
    })
    .join("");
  dom.copyButton.disabled = false;
  latestResultsSummary = buildResultsSummary(top1, top5);
  if (dom.resultsContainer) {
    dom.resultsContainer.classList.remove("hidden");
  }
}

function formatProbability(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "0.000";
  }
  return number.toFixed(3);
}

function buildResultsSummary(top1, top5) {
  const lines = [`Top-1: ${top1.label} (${formatProbability(top1.prob)})`, "Top-5:"];
  top5.forEach((entry, idx) => {
    lines.push(`${idx + 1}. ${entry.label} (${formatProbability(entry.prob)})`);
  });
  return lines.join("\n");
}

async function copyResults() {
  if (!latestResultsSummary) {
    return;
  }
  try {
    await navigator.clipboard.writeText(latestResultsSummary);
    setStatus("Results copied to clipboard.", "success");
  } catch (error) {
    console.warn("Could not copy results.", error);
    setStatus("Could not copy results. Please copy manually.", "error");
  }
}

function showProgress(visible) {
  dom.progress.classList.toggle("hidden", !visible);
}

function setStatus(message, type = "info") {
  if (!message) {
    dom.status.textContent = "";
    dom.status.className = "status hidden";
    return;
  }
  dom.status.textContent = message;
  dom.status.className = "status";
  const cssClass = statusTypes[type] || statusTypes.info;
  dom.status.classList.add(cssClass);
}

function disposeTensor(tensor) {
  if (!tensor) {
    return;
  }
  if (Array.isArray(tensor)) {
    tensor.forEach(disposeTensor);
    return;
  }
  if (typeof tensor.dispose === "function") {
    tensor.dispose();
  }
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch (error) {
    console.warn("Could not read response body.", error);
    return "";
  }
}

async function ensureImageReady(imageElement) {
  if (!imageElement) {
    throw new Error("Preview image not found.");
  }
  if (imageElement.complete && imageElement.naturalWidth > 0) {
    return;
  }
  await new Promise((resolve, reject) => {
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Could not load the image for inference."));
    };
    const cleanup = () => {
      imageElement.removeEventListener("load", onLoad);
      imageElement.removeEventListener("error", onError);
    };
    imageElement.addEventListener("load", onLoad, { once: true });
    imageElement.addEventListener("error", onError, { once: true });
  });
}

async function resourceExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.warn(`Could not verify existence of ${url}:`, error);
    return false;
  }
}

function clearSelection() {
  currentFile = null;
  dom.dropText.textContent = DEFAULT_DROP_TEXT;
  dom.previewImage.hidden = true;
  dom.previewImage.removeAttribute("src");
  dragCounter = 0;
  dom.dropZone.classList.remove("drop-zone--over");
  resetResults();
}
