import { motion } from "framer-motion";
import { FaRobot, FaFilePdf, FaCheckCircle } from "react-icons/fa";

function DashboardPreview() {
  return (
    <motion.div
      animate={{
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="
        relative
        w-[520px]
        rounded-3xl
        border
        border-cyan-500/20
        bg-slate-900/80
        backdrop-blur-xl
        p-8
        shadow-[0_0_80px_rgba(6,182,212,0.18)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaRobot className="text-cyan-400" />
          AI Assistant
        </h2>

        <span className="text-green-400 text-sm">
          ● Online
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-700 my-5"></div>

      {/* PDF Upload */}
      <motion.div
        animate={{
          x: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-3"
      >
        <FaFilePdf className="text-red-400 text-2xl" />

        <div>
          <p className="font-semibold">
            DBMS_Notes.pdf
          </p>

          <p className="text-slate-400 text-sm">
            Uploaded Successfully
          </p>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Processing...</span>
          <span>100%</span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
            }}
            className="bg-cyan-400 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-green-400" />
          <span>Notes Generated</span>
        </div>

        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-green-400" />
          <span>Quiz Ready</span>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardPreview;