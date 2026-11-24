
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import RecentActivity from "./RecentActivity";
import StatCard from "./StatCard";

import {
  FaFilePdf,
  FaRobot,
  FaStickyNote,
  FaQuestionCircle,
  FaClone,
} from "react-icons/fa";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () => {
      try {
        const [statsResponse, pdfResponse] = await Promise.all([
          api.get("ai/dashboard/"),
          api.get("documents/list/"),
        ]);

        if (!active) return;

        setStats((previous) => ({
          ...previous,
          ...(statsResponse.data || {}),
        }));

        const documents = Array.isArray(pdfResponse.data)
          ? pdfResponse.data
          : pdfResponse.data?.results || [];

        setRecentPDFs(documents.slice(0, 5));
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error.response?.data || error.message
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const openFeature = (feature) => {
    if (recentPDFs.length === 0) {
      navigate("/upload");
      return;
    }

    navigate(`/${feature}/${recentPDFs[0].id}`);
  };

  const featureButtonClass =
    "px-3 py-2 rounded-lg text-sm font-semibold transition hover:brightness-110";

  return (
    <div>
      {/* Dashboard Heading */}

      <h1 className="text-5xl font-bold text-white">
        Welcome Back!
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
          Recent Uploads
        </h2>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          {loading ? (
            <p className="text-slate-400">Loading your PDFs...</p>
          ) : recentPDFs.length === 0 ? (
            <p className="text-slate-400">
              No PDFs uploaded yet. Upload a PDF to get started.
            </p>
          ) : (
            recentPDFs.map((pdf) => (
              <div
                key={pdf.id}
                className="py-5 border-b border-white/10 last:border-0"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                  <div>
                    <h3 className="text-white font-semibold">
                      {pdf.title}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      {pdf.uploaded_at
                        ? new Date(pdf.uploaded_at).toLocaleString()
                        : "Upload date unavailable"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/chat/${pdf.id}`)}
                      className={`${featureButtonClass} bg-cyan-500 text-black`}
                    >
                      Chat
                    </button>

                    <button
                      onClick={() => navigate(`/notes/${pdf.id}`)}
                      className={`${featureButtonClass} bg-blue-500 text-white`}
                    >
                      Notes
                    </button>

                    <button
                      onClick={() => navigate(`/quiz/${pdf.id}`)}
                      className={`${featureButtonClass} bg-purple-500 text-white`}
                    >
                      Quiz
                    </button>

                    <button
                      onClick={() => navigate(`/flashcards/${pdf.id}`)}
                      className={`${featureButtonClass} bg-green-500 text-black`}
                    >
                      Flashcards
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}

      <div className="grid md:grid-cols-2 gap-6 mt-14">
        <RecentActivity documents={recentPDFs} />

        {/* Upload PDF */}

        <div
          onClick={() => navigate("/upload")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-cyan-400 hover:scale-105 transition duration-300"
        >
          <h2 className="text-2xl font-bold text-white">
            Upload PDF
          </h2>

          <p className="text-slate-400 mt-3">
            Upload your study materials and organize them for AI-powered learning.
          </p>
        </div>

        {/* AI Chat */}

        <div
          onClick={() => openFeature("chat")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-green-400 hover:scale-105 transition duration-300"
        >
          <FaRobot className="text-green-400 text-3xl mb-4" />

          <h2 className="text-2xl font-bold text-white">
            AI Chat
          </h2>

          <p className="text-slate-400 mt-3">
            Chat with your previously uploaded PDFs and get instant answers.
          </p>
        </div>

        {/* Notes */}

        <div
          onClick={() => openFeature("notes")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-blue-400 hover:scale-105 transition duration-300"
        >
          <FaStickyNote className="text-blue-400 text-3xl mb-4" />

          <h2 className="text-2xl font-bold text-white">
            AI Notes
          </h2>

          <p className="text-slate-400 mt-3">
            Generate organized study notes from your uploaded PDF.
          </p>
        </div>

        {/* Quiz */}

        <div
          onClick={() => openFeature("quiz")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-purple-400 hover:scale-105 transition duration-300"
        >
          <FaQuestionCircle className="text-purple-400 text-3xl mb-4" />

          <h2 className="text-2xl font-bold text-white">
            AI Quiz
          </h2>

          <p className="text-slate-400 mt-3">
            Test your understanding with AI-generated quizzes.
          </p>
        </div>

        {/* Flashcards */}

        <div
          onClick={() => openFeature("flashcards")}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl cursor-pointer hover:border-yellow-400 hover:scale-105 transition duration-300"
        >
          <FaClone className="text-yellow-400 text-3xl mb-4" />

          <h2 className="text-2xl font-bold text-white">
            AI Flashcards
          </h2>

          <p className="text-slate-400 mt-3">
            Revise important concepts using AI-generated flashcards.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
