import React, { useState } from "react";

type NavbarProps = {
  setActiveTab: (tab: "upload" | "files" | "search" | "ask") => void;
};

function Navbar({ setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <h1 className="text-lg sm:text-xl font-bold">📂 QA Mini Asistente</h1>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
  
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>


          <div className="hidden md:flex space-x-6">
            <button onClick={() => setActiveTab("upload")} className="hover:text-gray-300">Subir</button>
            <button onClick={() => setActiveTab("files")} className="hover:text-gray-300">Archivos</button>
            <button onClick={() => setActiveTab("search")} className="hover:text-gray-300">Buscar</button>
            <button onClick={() => setActiveTab("ask")} className="hover:text-gray-300">Preguntar</button>
          </div>
        </div>

   
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <button onClick={() => setActiveTab("upload")} className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded">Subir</button>
            <button onClick={() => setActiveTab("files")} className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded">Archivos</button>
            <button onClick={() => setActiveTab("search")} className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded">Buscar</button>
            <button onClick={() => setActiveTab("ask")} className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded">Preguntar</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
