# Project in progress

This module is under construction. The goal is to deliver an energy
forecasting MVP with a GRU without exposing real data. Current guidelines:

- Planned architecture: electricity consumption ingestion + academic calendar -> cleaning -> tensorization -> sequential GRU -> metrics and educational dashboard.
- Operating approach: local venv for prototypes, final run in Colab, and a Streamlit dashboard with an internal conversational assistant.
- Security goals: use `.env` for keys, dataset anonymization, and replacing temporary environments before publishing.
- Next milestones: consolidate preprocessing, train GRU (64/32 units) with early callbacks, and prepare a video demo.

We will update this file when development moves to the next phase.
