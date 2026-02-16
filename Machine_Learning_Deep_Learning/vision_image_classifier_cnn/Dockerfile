# Base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies if needed (e.g. for cv2 or others, but pure tensorflow/keras is usually fine)
# Update pip
RUN pip install --upgrade pip

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PORT=8080
ENV TF_CPP_MIN_LOG_LEVEL=2

# Expose the port
EXPOSE 8080

# Run the API server
CMD ["python", "ui/api_server.py"]
