import React, { useState } from "react";

export default function AskDocs() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No se encontró respuesta.");
      setCitations(data.citations || []); // si el back devuelve citas
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
                  <li key={i}>{cita}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
