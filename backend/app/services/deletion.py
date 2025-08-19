import os

UPLOAD_DIR = "uploaded_files"

async def delete_document_logic(filename: str):
    try:
        file_path = os.path.join(UPLOAD_DIR, filename)

        if os.path.exists(file_path):
            os.remove(file_path)
            return {"message": f"Documento {filename} eliminado correctamente."}
        else:
            return {"error": f"No se encontró el documento {filename}."}
    except Exception as e:
        return {"error": str(e)}
