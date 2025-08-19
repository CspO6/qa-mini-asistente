from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import FileResponse
from typing import List

from app.services.file_processing import process_files
from app.services.question_answering import search_query, answer_question
from app.services.deletion import delete_document_logic
from app.services.file_access import list_uploaded_files, get_uploaded_file_response


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
def get_files():
    return list_uploaded_files()

@router.get("/uploaded_files/{filename}")
def get_file(filename: str):
    return get_uploaded_file_response(filename)

@router.delete("/delete")
async def delete_document(filename: str = Query(..., description="Nombre exacto del archivo")):
    return await delete_document_logic(filename)