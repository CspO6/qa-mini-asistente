import { useState } from "react";

function SearchDocs() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false); // ✅ Para saber si ya se buscó

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Error al buscar documentos");
      const data = await response.json();

      setResults(Array.isArray(data) ? data : []);
      setSearched(true); // ✅ Marcamos que ya hubo búsqueda
    } catch (err) {
      console.error(err);
      setResults([]);
      setSearched(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Buscar en documentos</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe algo para buscar..."
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Mensajes dinámicos */}
      {!searched && <p className="text-gray-500">Escribe algo y presiona buscar.</p>}
      {searched && results.length === 0 && (
        <p className="text-red-500">No se encontraron coincidencias.</p>
      )}

      <ul className="space-y-3">
        {results.map((r, idx) => (
          <li key={idx} className="border-b pb-2">
            <p><strong>Archivo:</strong> {r.document}</p>
            <p><strong>Coincidencia:</strong> {r.score.toFixed(3)}</p>
            <p className="text-gray-700">{r.fragment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchDocs;
