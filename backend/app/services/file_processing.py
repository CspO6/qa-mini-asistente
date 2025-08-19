import os
from fastapi import UploadFile
from typing import List
from .text_extraction import extract_text
from .similarity_engine import vectorizer, documents, filenames, set_tfidf_matrix

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def process_files(files: List[UploadFile]):
    documents.clear()
    filenames.clear()

    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # Guardar archivo
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Reabrir para extraer texto
        with open(file_path, "rb") as f:
            fake_upload = UploadFile(filename=file.filename, file=f)
            text = extract_text(fake_upload)

        documents.append(text)
        filenames.append(file.filename)

    set_tfidf_matrix(vectorizer.fit_transform(documents))
    return {"message": f"{len(files)} archivos subidos correctamente."}
