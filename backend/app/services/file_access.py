import os
from fastapi.responses import FileResponse

UPLOAD_DIR = "uploaded_files"

def list_uploaded_files():
    if not os.path.exists(UPLOAD_DIR):
        return []
    return os.listdir(UPLOAD_DIR)

def get_uploaded_file_response(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return {"detail": "Not Found"}
    return FileResponse(file_path, media_type="application/pdf", filename=filename)
