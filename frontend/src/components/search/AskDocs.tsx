import React, { useState } from "react";
import { askQuestion, getFileURL } from "../../services/api";

export default function AskDocs() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    const trimmed = question.trim();

    // Validaciones
    if (!trimmed) {
      setError("La pregunta no puede estar vacía.");
      setAnswer(null);
      setCitations([]);
      return;
    }

    if (trimmed.length < 5) {
      setError("La pregunta es demasiado corta.");
      setAnswer(null);
      setCitations([]);
      return;
    }

    if (trimmed.length > 300) {
      setError("La pregunta es demasiado larga.");
      setAnswer(null);
      setCitations([]);
      return;
    }

    if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
      setError("La pregunta no contiene caracteres válidos.");
      setAnswer(null);
      setCitations([]);
      return;
    }

    // (opcional) caracteres peligrosos tipo < > etc.
    if (/[<>]/.test(trimmed)) {
      setError("La pregunta contiene caracteres no permitidos.");
      setAnswer(null);
      setCitations([]);
      return;
    }

    setError(null);

    try {
      const data = await askQuestion(trimmed);
      setAnswer(data.answer || "No se encontró respuesta.");
      setCitations(data.citations || []);
    } catch (err) {
      setAnswer("Error consultando la API.");
      setCitations([]);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Preguntar a los documentos</h2>

      <textarea
        className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
        rows={3}
        placeholder="Escribe tu pregunta aquí..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Preguntar
      </button>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {answer && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <p className="text-gray-700">
            <strong>Respuesta:</strong> {answer}
          </p>

          {citations?.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              <strong>Fuentes:</strong>
              <ul className="list-disc list-inside">
                {citations.map((cita, i) => (
                  <li key={i}>
                   <a
                      href={getFileURL(cita)}
                      download
                      className="text-blue-600 hover:underline"
                    >
                      {cita}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
