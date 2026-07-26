import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaStickyNote,
  FaQuestionCircle,
  FaClone,
  FaFilePdf,
  FaTrash,
} from "react-icons/fa";

import api from "../api/api";
import DeleteModal from "./DeleteModal";

function PDFCard({ pdf, onDelete }) {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deletePDF = async () => {
    try {
      await api.delete(`documents/delete/${pdf.id}/`);

      setShowDeleteModal(false);

      if (onDelete) {
        onDelete(pdf.id);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to delete PDF.");
    }
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-cyan-400 transition">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center text-white text-2xl">
            <FaFilePdf />
          </div>

          <div>
            <h2 className="text-white text-xl font-bold">
              {pdf.title}
            </h2>

            <p className="text-slate-400 text-sm">
              {new Date(pdf.uploaded_at).toLocaleString()}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            onClick={() => navigate(`/chat/${pdf.id}`)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl py-2 font-semibold flex justify-center items-center gap-2"
          >
            <FaComments />
            Chat
          </button>

          <button
            onClick={() => navigate(`/notes/${pdf.id}`)}
            className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl py-2 font-semibold flex justify-center items-center gap-2"
          >
            <FaStickyNote />
            Notes
          </button>

          <button
            onClick={() => navigate(`/quiz/${pdf.id}`)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl py-2 font-semibold flex justify-center items-center gap-2"
          >
            <FaQuestionCircle />
            Quiz
          </button>

          <button
            onClick={() => navigate(`/flashcards/${pdf.id}`)}
            className="bg-green-500 hover:bg-green-400 text-black rounded-xl py-2 font-semibold flex justify-center items-center gap-2"
          >
            <FaClone />
            Flashcards
          </button>

        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-5 w-full bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 font-semibold flex justify-center items-center gap-2"
        >
          <FaTrash />
          Delete PDF
        </button>

      </div>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deletePDF}
        title={pdf.title}
      />
    </>
  );
}

export default PDFCard;