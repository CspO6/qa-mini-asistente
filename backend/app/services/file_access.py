import os
from fastapi.responses import FileResponse
from fastapi import HTTPException

UPLOAD_DIR = "uploaded_files"
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx"}
MAX_FILE_SIZE_MB = 5
MAX_LISTED_FILES = 100  # Por ejemplo, puedes ajustarlo

def list_uploaded_files():
    if not os.path.exists(UPLOAD_DIR):
        return []

    files = os.listdir(UPLOAD_DIR)
    # Limitar cantidad y asegurar extensión válida
    safe_files = []
    for filename in files:
        ext = os.path.splitext(filename)[1].lower()
        if ext in ALLOWED_EXTENSIONS:
            safe_files.append(filename)
        if len(safe_files) >= MAX_LISTED_FILES:
            break
    return safe_files

def get_uploaded_file_response(filename: str):
    # Seguridad: evitar traversal como ../../etc/passwd
    if "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Nombre de archivo inválido.")

    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado.")

    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Tipo de archivo no permitido.")

    # Validar tamaño
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail="Archivo demasiado grande.")

    return FileResponse(file_path, media_type="application/octet-stream", filename=filename)
