import React from "react";

type NavbarProps = {
  setActiveTab: (tab: "upload" | "files" | "search" | "ask") => void;
};

function Navbar({ setActiveTab }: NavbarProps) {
  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Nombre app */}
        <h1 className="text-xl font-bold">📂 QA Mini Asistente</h1>

        {/* Links */}
        <div className="flex space-x-6">
          <button onClick={() => setActiveTab("upload")} className="hover:text-gray-300">Subir</button>
          <button onClick={() => setActiveTab("files")} className="hover:text-gray-300">Archivos</button>
          <button onClick={() => setActiveTab("search")} className="hover:text-gray-300">Buscar</button>
          <button onClick={() => setActiveTab("ask")} className="hover:text-gray-300">Preguntar</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

