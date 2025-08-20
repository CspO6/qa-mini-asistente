# 🧠 Mini Asistente de Q&A

Aplicación web que permite subir documentos PDF/TXT, realizar búsquedas dentro de ellos y hacer preguntas en lenguaje natural, obteniendo respuestas breves con citas de los documentos.

---

## 🚀 Tecnologías Utilizadas

- **Backend**: FastAPI (Python)
- **Frontend**: React + TypeScript
- **Motor de búsqueda**: TF-IDF con Scikit-learn
- **Contenedores**: Docker + Docker Compose
- **Otros**: SweetAlert2, Lucide React, Tailwind CSS

---

## ✅ Funcionalidades Implementadas

### 📂 Subida de archivos

- Se pueden subir entre 3 y 10 archivos `.pdf` o `.txt`.
- Se valida el tipo de archivo y el tamaño máximo permitido (5 MB).
- Los archivos subidos se almacenan y pueden visualizarse o eliminarse desde la interfaz.

### 🔍 Búsqueda de contenido (`/search`)

- Endpoint: `GET /search?q=...`
- Realiza búsqueda de los fragmentos más relevantes mediante TF-IDF.
- Devuelve:
  - Fragmento del texto
  - Nombre del documento
  - Puntaje de relevancia

### ❓ Preguntas en lenguaje natural (`/ask`)

- Endpoint: `POST /ask`
- Recibe una pregunta como JSON (`{ "question": "..." }`).
- Responde en 3–4 líneas con citas relevantes (1–3 fuentes).
- Utiliza los fragmentos con mayor score como contexto para generar la respuesta.

### 📦 Ingesta de documentos (`/ingest`)

- Endpoint: `POST /ingest`
- Procesa e indexa múltiples archivos recibidos en memoria.
- Divide en fragmentos para indexar con TF-IDF.

---

## 📸 Capturas de Pantalla

![Demo QA Mini Asistente](./demo_qa_mini_asistente.gif)

## ⚙️ Instrucciones de ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/CspO6/qa-mini-asistente
cd qa-mini-asistente
```
2. Levanta los servicios:

docker-compose up --build

3. Accede a la app:

Frontend: http://localhost:3000

Backend: http://localhost:8000

🧠 Decisiones técnicas y supuestos

- Se usó TF-IDF para la búsqueda por simplicidad y rapidez.
- La generación de respuestas se hace extrayendo fragmentos, sin LLM.
- Los archivos se almacenan en uploaded_files/ en disco.
- El índice se mantiene en memoria (no persistente).
- Se validan extensiones y tamaños de archivo desde el backend y frontend.

⏱️ Tiempo invertido

9 horas en total:
- Backend (FastAPI): 3 horas
- Frontend (React + TypeScript): 3 horas
- Validaciones, estilos y pruebas: 1.5 horas
- Docker y documentación: 0.5 horas
- Pruebas finales y ajustes: 1 hora

🧪 Bonus Implementados

- Validaciones robustas de archivos (.txt, .pdf, 5MB)
- UI clara con estados de carga, error y éxito
- Citaciones clicables con enlaces al archivo
- Índice dividido por fragmentos
- Código limpio y modular
- Pruebas de backend

🐍 Backend (FastAPI + Pytest)
Se utiliza pytest para ejecutar las pruebas del backend.

📦 Instalar dependencias
Hay que asegurarse de tener un entorno virtual y las dependencias instaladas:

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
```

▶️ Ejecutar pruebas

```bash
pytest
```