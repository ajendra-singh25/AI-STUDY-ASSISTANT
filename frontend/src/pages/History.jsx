import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

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

    setLoading(false);
  };

  const deletePDF = async (id) => {
    if (!window.confirm("Delete this PDF?")) return;

    try {
      await api.delete(`documents/delete/${id}/`);

      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white">
        Upload History
      </h1>

      <p className="text-slate-400 mt-2">
        Manage all your uploaded PDFs.
      </p>

      {loading ? (

        <div className="mt-10 text-cyan-400">
          Loading...
        </div>

      ) : (

        <div className="space-y-6 mt-10">

          {documents.map((doc) => (

            <div
              key={doc.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {doc.title}
                </h2>

                <p className="text-slate-400 mt-2">
                  Uploaded :
                  {" "}
                  {new Date(doc.uploaded_at).toLocaleString()}
                </p>

              </div>

              <div className="flex gap-3 flex-wrap">

                <button
                  onClick={() => navigate(`/chat/${doc.id}`)}
                  className="bg-cyan-500 px-4 py-2 rounded-xl text-black font-semibold"
                >
                  Chat
                </button>

                <button
                  onClick={() => navigate(`/notes/${doc.id}`)}
                  className="bg-blue-500 px-4 py-2 rounded-xl"
                >
                  Notes
                </button>

                <button
                  onClick={() => navigate(`/quiz/${doc.id}`)}
                  className="bg-yellow-500 px-4 py-2 rounded-xl text-black"
                >
                  Quiz
                </button>

                <button
                  onClick={() => navigate(`/flashcards/${doc.id}`)}
                  className="bg-green-500 px-4 py-2 rounded-xl text-black"
                >
                  Flashcards
                </button>

                <button
                  onClick={() => deletePDF(doc.id)}
                  className="bg-red-500 px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>
  );
}

export default History;