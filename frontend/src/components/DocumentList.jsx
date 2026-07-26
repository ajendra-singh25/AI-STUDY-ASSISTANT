import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import PDFCard from "./PDFCard";
import SearchBar from "./SearchBar";
function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("documents/list/");
      setDocuments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== id)
    );
  };
  const filteredDocuments = useMemo(() => {
  return documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );
}, [documents, search]);

  return (
    <div className="mt-12">

      <h2 className="text-3xl font-bold text-white mb-8">
        📚 Uploaded PDFs
      </h2>
      <SearchBar
  search={search}
  setSearch={setSearch}
/>

      {documents.length === 0 ? (

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">

          <h3 className="text-2xl text-slate-300">
            No PDFs Uploaded
          </h3>

          <p className="text-slate-500 mt-3">
            Upload your first PDF to start using the AI Study Assistant.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filteredDocuments.map((doc) => (

            <PDFCard
              key={doc.id}
              pdf={doc}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default DocumentList;