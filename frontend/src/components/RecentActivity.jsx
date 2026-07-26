import {
  FaFilePdf,
  FaRobot,
  FaStickyNote,
  FaQuestionCircle,
  FaClone,
} from "react-icons/fa";

function RecentActivity({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          📈 Recent Activity
        </h2>

        <p className="text-slate-400">
          No activity yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

      <h2 className="text-2xl font-bold text-white mb-8">
        📈 Recent Activity
      </h2>

      <div className="space-y-5">

        {documents.slice(0, 5).map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0"
          >
            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-black text-xl">
                <FaFilePdf />
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  Uploaded "{doc.title}"
                </h3>

                <p className="text-slate-400 text-sm">
                  {new Date(doc.uploaded_at).toLocaleString()}
                </p>
              </div>

            </div>

            <div className="flex gap-2 text-cyan-400 text-lg">

              <FaRobot />
              <FaStickyNote />
              <FaQuestionCircle />
              <FaClone />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentActivity;