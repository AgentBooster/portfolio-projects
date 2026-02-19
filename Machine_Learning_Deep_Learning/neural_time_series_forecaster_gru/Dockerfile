# Base Image: Official TensorFlow + Python (GPU Support)
FROM tensorflow/tensorflow:2.15.0-gpu

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and data
COPY src/ src/
COPY data/ data/
COPY models/ models/ 

# Default Command: Training Forecast (Can be overridden to run train_anomaly.py or other tools)
CMD ["python", "src/train_forecast.py"]
