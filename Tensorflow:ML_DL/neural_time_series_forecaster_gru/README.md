# Proyecto en desarrollo

Este módulo está en construcción. El objetivo es presentar un MVP de predicción energética con GRU sin exponer datos reales. Lineamientos actuales:

- Arquitectura prevista: ingestión de consumo eléctrico + calendario académico -> limpieza -> tensorización -> GRU secuencial -> métricas y dashboard educativo.
- Enfoque operativo: venv local para prototipos, ejecución final en Colab, y dashboard Streamlit con asistente conversacional interno.
- Metas de seguridad: uso de `.env` para llaves, anonimización de datasets y reemplazo de entornos temporales antes de publicar.
- Próximos hitos: consolidar preprocessing, entrenar GRU (64/32 unidades) con callbacks tempranos y preparar demo en video.

Actualizaremos este archivo cuando el desarrollo avance a la siguiente fase.
