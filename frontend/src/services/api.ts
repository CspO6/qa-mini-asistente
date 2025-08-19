const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return fetch(`${API_URL}/ingest`, { method: "POST", body: formData });
}

export async function searchQuery(q: string) {
  return fetch(`${API_URL}/search?q=${q}`).then(res => res.json());
}

export async function askQuestion(question: string) {
  return fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question })
  }).then(res => res.json());
}

export async function getUploadedFiles(): Promise<string[]> {
  const response = await fetch(`${API_URL}/files`);
  if (!response.ok) throw new Error("Error al obtener archivos");
  return response.json();
}

export async function deleteFile(filename: string) {
  const response = await fetch(`${API_URL}/delete?filename=${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar archivo");
  return response.json();
}

export function getFileURL(filename: string) {
  return `${API_URL}/uploaded_files/${encodeURIComponent(filename)}`;
}

