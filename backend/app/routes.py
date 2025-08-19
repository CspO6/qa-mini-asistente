from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import FileResponse
from typing import List
from app.logic import process_files, search_query, answer_question, delete_document_logic
import os

router = APIRouter()
UPLOAD_DIR = "./uploaded_files"

@router.post("/ingest")
async def ingest(files: List[UploadFile] = File(...)):
    return await process_files(files)

@router.get("/search")
async def search(q: str = Query(...)):
    return search_query(q)

@router.post("/ask")
async def ask(question: dict):
    return answer_question(question.get("question", ""))

@router.get("/files")
def list_uploaded_files():
    if not os.path.exists(UPLOAD_DIR):
        return []
    return os.listdir(UPLOAD_DIR)

@router.get("/uploaded_files/{filename}")
def get_uploaded_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return {"detail": "Not Found"}
    return FileResponse(file_path, media_type="application/pdf", filename=filename)

@router.delete("/delete")
async def delete_document(filename: str = Query(..., description="Nombre exacto del archivo")):
    return await delete_document_logic(filename)