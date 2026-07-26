import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import RecentActivity from "./RecentActivity";
import {
  FaFilePdf,
  FaRobot,
  FaStickyNote,
  FaQuestionCircle,
} from "react-icons/fa";

import StatCard from "./StatCard";

function DashboardHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pdfs: 0,
    chats: 0,
    notes: 0,
    quizzes: 0,
    flashcards: 0,
  });

  const [recentPDFs, setRecentPDFs] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsResponse = await api.get("ai/dashboard/");
      setStats(statsResponse.data);

      const pdfResponse = await api.get("documents/list/");
      setRecentPDFs(pdfResponse.data.slice(0, 5));

      console.log(pdfResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Heading */}

      <h1 className="text-5xl font-bold text-white">
        Welcome Back 👋
      </h1>

      <p className="text-slate-400 mt-3">
        Continue your AI-powered learning journey.
      </p>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        <StatCard
          title="PDF Uploaded"
          value={stats.pdfs}
          icon={<FaFilePdf />}
          color="#06b6d4"
        />

        <StatCard
          title="AI Chats"
          value={stats.chats}
          icon={<FaRobot />}
          color="#8b5cf6"
        />

        <StatCard
          title="Notes Generated"
          value={stats.notes}
          icon={<FaStickyNote />}
          color="#10b981"
        />

        <StatCard
          title="Quiz Completed"
          value={stats.quizzes}
          icon={<FaQuestionCircle />}
          color="#f59e0b"
        />
      </div>

      {/* Recent Uploads */}

      <div className="mt-14">
        <h2 className="text-3xl font-bold text-white mb-6">
          📄 Recent Uploads
        </h2>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          {recentPDFs.length === 0 ? (
            <p className="text-slate-400">
              No PDFs uploaded yet.
            </p>
          ) : (
            recentPDFs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex justify-between items-center py-4 border-b border-white/10 last:border-0"
              >
                <div>
                  <h3 className="text-white font-semibold">
                    {pdf.title}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    {new Date(pdf.uploaded_at).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/chat/${pdf.id}`)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2 rounded-xl transition"
                >
                  Open
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}

      <div className="grid md:grid-cols-2 gap-6 mt-14">
        <RecentActivity
  documents={recentPDFs}
/>
        {/* Upload */}

        <div
          onClick={() => navigate("/upload")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-cyan-400 hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-bold text-white">
            📄 Upload PDF
          </h2>

          <p className="text-slate-400 mt-3">
            Upload your study materials and organize them for AI-powered learning.
          </p>
        </div>

        {/* AI Chat */}

        <div
          onClick={() => navigate("/upload")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-green-400 hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-bold text-white">
            🤖 AI Chat
          </h2>

          <p className="text-slate-400 mt-3">
            Chat with your PDFs and get instant answers.
          </p>
        </div>

        {/* Notes */}

        <div
          onClick={() => navigate("/upload")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-blue-400 hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-bold text-white">
            📝 AI Notes
          </h2>

          <p className="text-slate-400 mt-3">
            Generate concise notes from your uploaded PDFs.
          </p>
        </div>

        {/* Quiz */}

        <div
          onClick={() => navigate("/upload")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-yellow-400 hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-bold text-white">
            ❓ Quiz Generator
          </h2>

          <p className="text-slate-400 mt-3">
            Test your knowledge using AI-generated quizzes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;