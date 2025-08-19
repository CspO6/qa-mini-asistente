import os
from fastapi import UploadFile, HTTPException
from typing import List
from .text_extraction import extract_text
from .similarity_engine import (
    vectorizer, documents, filenames, set_tfidf_matrix,
    save_index, load_index
)

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configuraciones de validación
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx"}
MAX_FILE_SIZE_MB = 5
MAX_FILES_UPLOAD = 10

# Cargar índice al iniciar si existe
load_index()

async def process_files(files: List[UploadFile]):
    if len(files) > MAX_FILES_UPLOAD:
        raise HTTPException(status_code=400, detail=f"Máximo {MAX_FILES_UPLOAD} archivos permitidos por subida.")

    documents.clear()
    filenames.clear()

    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Tipo de archivo no permitido: {file.filename}")

        if "/" in file.filename or "\\" in file.filename:
            raise HTTPException(status_code=400, detail=f"Nombre de archivo inválido: {file.filename}")

        content = await file.read()
        size_mb = len(content) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(status_code=413, detail=f"El archivo '{file.filename}' excede el tamaño máximo de {MAX_FILE_SIZE_MB} MB.")

        file_path = os.path.join(UPLOAD_DIR, file.filename)
        # Prevención de sobrescritura (opcional)
        if os.path.exists(file_path):
            raise HTTPException(status_code=409, detail=f"El archivo '{file.filename}' ya existe.")

        # Guardar archivo
        with open(file_path, "wb") as f:
            f.write(content)

        # Reabrir para extraer texto
        with open(file_path, "rb") as f:
            fake_upload = UploadFile(filename=file.filename, file=f)
            text = extract_text(fake_upload)

        documents.append(text)
        filenames.append(file.filename)

    # Construir el índice y guardarlo
    matrix = vectorizer.fit_transform(documents)
    set_tfidf_matrix(matrix)
    save_index()

    return {"message": f"{len(files)} archivos subidos correctamente."}
