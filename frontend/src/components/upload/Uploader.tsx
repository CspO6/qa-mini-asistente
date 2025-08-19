import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { UploadCloud, Trash } from "lucide-react";
import { uploadFiles, getUploadedFiles, deleteFile } from "../../services/api";

function UploadPDF() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const validExtensions = [".pdf", ".txt"];

  const fetchUploadedFiles = async () => {
    try {
      const data = await getUploadedFiles();
      if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor.");
      setUploadedFiles(data);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
      Swal.fire("Error", "No se pudieron cargar los archivos.", "error");
    }
  };

  const handleDelete = async (filename: string) => {
    if (!filename || filename.trim().length === 0) {
      Swal.fire("Error", "Nombre de archivo inválido.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el archivo "${filename}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteFile(filename);
        Swal.fire("Eliminado", "El archivo fue eliminado correctamente.", "success");
        fetchUploadedFiles();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar el archivo.", "error");
      }
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      Swal.fire("Error", "Debes seleccionar al menos un archivo.", "error");
      return;
    }

    const fileArray = Array.from(files);

    const invalidFiles = fileArray.filter(
      (file) => !validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );

    if (invalidFiles.length > 0) {
      Swal.fire(
        "Error",
        `Los siguientes archivos no son válidos (.pdf o .txt):\n${invalidFiles.map((f) => f.name).join(", ")}`,
        "error"
      );
      return;
    }

    const tooBigFiles = fileArray.filter((file) => file.size > MAX_FILE_SIZE_BYTES);

    if (tooBigFiles.length > 0) {
      Swal.fire(
        "Error",
        `Los siguientes archivos exceden los ${MAX_FILE_SIZE_MB}MB permitidos:\n${tooBigFiles
          .map((f) => f.name)
          .join(", ")}`,
        "error"
      );
      return;
    }

    try {
      await uploadFiles(fileArray);
      Swal.fire({
        title: "¡Éxito!",
        text: `${files.length} archivo(s) subido(s) correctamente.`,
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      });
      setFiles(null);
      fetchUploadedFiles();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron subir los archivos.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 px-4 pt-8 pb-12 space-y-6 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 sm:p-8 rounded-xl w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Subir archivos PDF o TXT</h2>

        <label className="w-full cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded text-center transition">
          Elegir archivos
          <input
            type="file"
            multiple
            accept=".pdf,.txt"
            onChange={(e) => setFiles(e.target.files)}
            className="hidden"
          />
        </label>

        {files && files.length > 0 && (
          <div className="bg-gray-100 p-2 rounded text-sm max-h-40 overflow-y-auto">
            <p className="font-semibold mb-1">Archivos seleccionados:</p>
            <ul className="list-disc list-inside">
              {Array.from(files).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          <UploadCloud className="w-5 h-5" />
          Subir Archivos
        </button>
      </form>

      {uploadedFiles.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg">
          <h3 className="text-lg font-semibold mb-3">Archivos ya procesados:</h3>
          <ul className="space-y-2 text-sm">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2"
              >
                <span className="break-words">{file}</span>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-500 hover:text-red-700 mt-1 sm:mt-0"
                  aria-label={`Eliminar ${file}`}
                >
                  <Trash className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadPDF;
