import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Trash } from 'lucide-react';

function UploadedFiles() {
  const [files, setFiles] = useState<string[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/files');
      if (!response.ok) throw new Error('Error al obtener archivos');
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (filename: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el archivo "${filename}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8000/delete?filename=${encodeURIComponent(filename)}`,
            {
              method: 'DELETE',
            }
          );

          if (!response.ok) throw new Error('Error al eliminar');

          Swal.fire('Eliminado', 'El archivo fue eliminado correctamente.', 'success');

          // refrescar lista
          fetchFiles();
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar el archivo.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Archivos subidos</h2>
      {files.length === 0 ? (
        <p className="text-gray-600">No hay archivos aún.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-1"
            >
              <a
                href={`http://localhost:8000/uploaded_files/${encodeURIComponent(file)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {file}
              </a>
              <button
                onClick={() => handleDelete(file)}
                className="text-red-500 hover:text-red-700"
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
