# TensorFlow ML & DL Inventory

A curated collection of Machine Learning and Deep Learning projects. This directory gathers experiments, prototypes, and demos focused on **TensorFlow/Keras**, featuring production-ready models and modular codebases.

<p align="center">
  <img src="assets/cover.png" alt="Portfolio cover" width="50%">
</p>

## 📂 Standardized Project Structure

- `*/README.md`: Specific documentation, metrics, and run steps.
- `*/notebooks/`: Interactive notebooks (inference demos & exploratory analysis, Open in Colab).
- `*/src/`: Core modules for data processing, training, and evaluation.
- `*/models/`: Trained weights or artifacts when applicable.
- `*/ui/`: User interfaces (Gradio, Streamlit, or Custom APIs) for local testing.

## ▶ How to start

1. **Choose a Project**

   Browse the directory and pick the project you are interested in (e.g., `vision_image_classifier_cnn`).

2. **Download the Code (clone only this project folder)**

   Run these commands in your terminal:

   ```bash
   # 1) Clone the repository in lightweight mode (no full checkout)
   git clone --filter=blob:none --no-checkout https://github.com/AgentBooster/portfolio-projects.git
   cd portfolio-projects

   # 2) Enable sparse-checkout and choose the exact project path
   git sparse-checkout init --cone
   git sparse-checkout set Machine_Learning_Deep_Learning/vision_image_classifier_cnn

   # 3) Checkout the branch (downloads/materializes only selected paths)
   git checkout main
   ```

3. **Run**

   Enter the folder, read its `README.md` for specific dependencies/commands, and run training/evaluation/inference as needed.

## ⚠️ Notes

- **Reproducibility**: Projects may include pre-trained models for immediate testing. Retraining scripts are provided if you wish to tune hyperparameters.
- **Performance Verification**: Training pipelines have been verified on Apple Silicon (MacBook Air M3). Please monitor resource usage if running heavy training locally.
