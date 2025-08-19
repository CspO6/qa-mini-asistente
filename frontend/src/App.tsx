import { useState } from "react";
import UploadPDF from "./components/Uploader";
import SearchBox from "./components/SearchResults";
import UploadedFiles from "./components/UploadedFiles";
import AskDocs from "./components/AskDocs"; 
import Navbar from "./components/Nav"; // 👈 renombrado bien

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "upload" | "files" | "search" | "ask"
  >("upload");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
 
      <Navbar setActiveTab={setActiveTab} />

      <div className="flex-1 w-full max-w-4xl mx-auto pt-20 p-6">
        {activeTab === "upload" && <UploadPDF />}
        {activeTab === "files" && <UploadedFiles />}
        {activeTab === "search" && <SearchBox />}
        {activeTab === "ask" && <AskDocs />}
      </div>
    </div>
  );
}
