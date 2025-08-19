from fastapi import UploadFile
from PyPDF2 import PdfReader

def extract_text(file: UploadFile):
    if file.filename.endswith(".txt"):
        return file.file.read().decode("utf-8")
    elif file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        return "\n".join([page.extract_text() or "" for page in reader.pages])
    return ""
