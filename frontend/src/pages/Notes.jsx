import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/api";
import ReactMarkdown from "react-markdown";

function Notes() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const response = await api.get(`ai/notes/${id}/`);

      setTitle(response.data.title);
      setNotes(response.data.notes);
    } catch (err) {
      console.log(err);
      setError("Unable to generate notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      alert("Notes copied successfully!");
    } catch (err) {
      alert("Failed to copy notes.");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white">
        AI Generated Notes
      </h1>

      <p className="text-slate-400 mt-2">
        PDF : <span className="text-cyan-400">{title}</span>
      </p>

      {loading ? (
        <div className="flex flex-col items-center mt-16">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>

          <p className="mt-6 text-cyan-400 text-lg font-semibold">
            AI is generating your notes...
          </p>
        </div>
      ) : error ? (
        <div className="mt-10 bg-red-500/20 border border-red-500 rounded-xl p-6 text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="mt-8 flex gap-4">
            <button
              onClick={copyNotes}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition"
            >
              📋 Copy Notes
            </button>
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="prose prose-invert max-w-none">
              {notes ? (
                <ReactMarkdown>{notes}</ReactMarkdown>
              ) : (
                <p className="text-slate-400">
                  No notes were generated from this PDF.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default Notes;