import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash } from "lucide-react";
import { getUploadedFiles, deleteFile, getFileURL } from "../../services/api";

function UploadedFiles() {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const data = await getUploadedFiles();

      if (!Array.isArray(data)) {
        throw new Error("Respuesta inesperada del servidor.");
      }

      setFiles(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setFiles([]);
      setError("No se pudieron cargar los archivos.");
    }
  };

  const handleDelete = async (filename: string) => {
    if (!filename || filename.trim().length === 0) {
      Swal.fire("Error", "Nombre de archivo inválido.", "error");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el archivo "${filename}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFile(filename);
          Swal.fire("Eliminado", "El archivo fue eliminado correctamente.", "success");
          fetchFiles();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "No se pudo eliminar el archivo.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow max-w-3xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Archivos subidos</h2>

      {error && <p className="text-red-600 text-center text-sm">{error}</p>}

      {files.length === 0 && !error ? (
        <p className="text-gray-600 text-center text-sm">No hay archivos aún.</p>
      ) : (
        <ul className="space-y-3 text-sm sm:text-base">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2"
            >
              <a
                href={getFileURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words whitespace-pre-wrap"
              >
                {file}
              </a>
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
      )}
    </div>
  );
}

export default UploadedFiles;
