import { useState } from "react";
import { searchQuery, getFileURL } from "../../services/api";

function SearchDocs() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleSearch = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setError("La búsqueda no puede estar vacía.");
      setResults([]);
      setSearched(false);
      return;
    }

    if (trimmed.length < 3) {
      setError("La búsqueda es demasiado corta.");
      setResults([]);
      setSearched(false);
      return;
    }

    if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
      setError("La búsqueda no contiene caracteres válidos.");
      setResults([]);
      setSearched(false);
      return;
    }

    if (trimmed.length > 100) {
      setError("La búsqueda es demasiado larga.");
      setResults([]);
      setSearched(false);
      return;
    }

    setError(null);
    setIsLoading(true); 
    try {
      const data = await searchQuery(trimmed);
      setResults(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setResults([]);
      setSearched(true);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow max-w-3xl mx-auto mt-4 space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
        Buscar en documentos
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe algo para buscar..."
          className="border p-2 rounded w-full text-sm sm:text-base"
        />
        <button
          type="submit"
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
              Buscando...
            </div>
          ) : (
            "Buscar"
          )}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      {!searched && !error && <p className="text-gray-500 text-center">Escribe algo y presiona buscar.</p>}
      {searched && results.length === 0 && !isLoading && (
        <p className="text-red-500 text-center">No se encontraron coincidencias.</p>
      )}

      {!isLoading && results.length > 0 && (
        <ul className="space-y-4 text-sm sm:text-base">
          {results.map((r, idx) => (
            <li key={idx} className="border-b pb-2">
              <p>
                <strong>Archivo:</strong>{" "}
                <a
                  href={getFileURL(r.document)}
                  download
                  className="text-blue-600 hover:underline break-all"
                >
                  {r.document}
                </a>
              </p>
              <p><strong>Coincidencia:</strong> {r.score.toFixed(3)}</p>
              <p className="text-gray-700 whitespace-pre-wrap">{r.fragment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchDocs;
