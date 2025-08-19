from fastapi import UploadFile
from PyPDF2 import PdfReader
import os

ALLOWED_EXTENSIONS = {".pdf", ".txt"}

def extract_text(file: UploadFile):
    filename = file.filename
    extension = os.path.splitext(filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Tipo de archivo no permitido: {extension}")

    try:
        if extension == ".txt":
            content = file.file.read()
            return content.decode("utf-8", errors="ignore")
        elif extension == ".pdf":
            reader = PdfReader(file.file)
            return "\n".join([page.extract_text() or "" for page in reader.pages])
    except Exception as e:
        print(f"Error extrayendo texto de {filename}: {e}")
        return ""

    return ""
