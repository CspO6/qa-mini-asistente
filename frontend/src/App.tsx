import { useState } from "react";
import UploadPDF from "./components/upload/Uploader";
import SearchBox from "./components/search/SearchResults";
import UploadedFiles from "./components/upload/UploadedFiles";
import AskDocs from "./components/search/AskDocs"; 
import Navbar from "./components/layout/Nav"; // 👈 renombrado bien

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
