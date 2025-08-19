import sys
import os
from fastapi.testclient import TestClient
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.main import app



client = TestClient(app)
TEST_FILE = "archivo.txt"

def test_get_uploaded_file_success():
    # Crear archivo manualmente
    path = os.path.join("uploaded_files", TEST_FILE)
    os.makedirs("uploaded_files", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write("contenido de prueba")

    response = client.get(f"/uploaded_files/{TEST_FILE}")  # 👈 ruta corregida
    assert response.status_code == 200


def test_upload_and_query_pdf():
    path = "uploaded_files/archivo.txt"
    if os.path.exists(path):
        os.remove(path)

    content = b"Este es un documento de prueba para QA."
    files = {"files": ("archivo.txt", content, "text/plain")}

    response = client.post("/ingest", files=files)
    assert response.status_code == 200

def test_search_existing_term():
    # Se asume que el archivo ya fue procesado e indexado
    query = "prueba"
    response = client.get(f"/search?q={query}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_ask_question():
    question_data = {"question": "¿Qué es QA?"}
    response = client.post("/ask", json=question_data)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "respuesta" in data or "answer" in data 

def test_delete_uploaded_file():
    # Asegúrate que el archivo esté previamente cargado
    response = client.delete("/delete", params={"filename": TEST_FILE})
    assert response.status_code == 200
    data = response.json()
    assert "message" in data or "detail" in data  