import React, { useState } from "react";
import { askQuestion, getFileURL } from "../../services/api";

export default function AskDocs() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleAsk = async () => {
    const trimmed = question.trim();

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

    if (/[<>]/.test(trimmed)) {
      setError("La pregunta contiene caracteres no permitidos.");
      setAnswer(null);
      setCitations([]);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await askQuestion(trimmed);
      setAnswer(data.answer || "No se encontró respuesta.");
      setCitations(data.citations || []);
    } catch (err) {
      setAnswer("Error consultando la API.");
      setCitations([]);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 max-w-3xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
        Preguntar a los documentos
      </h2>

      <textarea
        className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 text-sm sm:text-base"
        rows={3}
        placeholder="Escribe tu pregunta aquí..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          onClick={handleAsk}
          disabled={isLoading} 
          className={`px-4 py-2 rounded text-sm sm:text-base transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Cargando...
            </div>
          ) : (
            "Preguntar"
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-1 text-center">{error}</p>}

      {answer && !isLoading && (
        <div className="mt-4 p-3 border rounded bg-gray-50 text-sm sm:text-base">
          <p className="text-gray-700 mb-2">
            <strong>Respuesta:</strong> {answer}
          </p>

          {citations?.length > 0 && (
            <div className="mt-2 text-gray-600">
              <strong>Fuentes:</strong>
              <ul className="list-disc list-inside space-y-1">
                {citations.map((cita, i) => (
                  <li key={i}>
                    <a
                      href={getFileURL(cita)}
                      download
                      className="text-blue-600 hover:underline break-all"
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
