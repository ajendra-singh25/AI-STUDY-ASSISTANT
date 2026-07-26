import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";
import { Link } from "react-router-dom";
function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="
      relative
      z-10
      min-h-screen
      max-w-7xl
      mx-auto
      px-8
      flex
      flex-col
      lg:flex-row
      items-center
      justify-between
      gap-16
      overflow-hidden
      "
    >
      {/* Animated Glow 1 */}

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
        absolute
        -top-40
        -left-40
        w-96
        h-96
        rounded-full
        bg-cyan-500/20
        blur-3xl
        -z-10
        "
      />

      {/* Animated Glow 2 */}

      <motion.div
        animate={{
          scale: [1.2, 0.9, 1.2],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
        absolute
        bottom-0
        right-0
        w-[500px]
        h-[500px]
        rounded-full
        bg-blue-600/20
        blur-3xl
        -z-10
        "
      />

      {/* Left */}

      <div className="relative z-10 flex-1 max-w-3xl">
        <h1 className="text-7xl font-black leading-tight text-white">
          Study <span className="text-cyan-400">Smarter</span> with AI
        </h1>

        <p className="mt-6 text-slate-300 text-xl">
          Upload PDFs, generate notes, create quizzes,
          and chat with your study material using AI.
        </p>
<div className="mt-10 flex gap-5">
  <Link
    to="/login"
    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl transition hover:scale-105"
  >
    Get Started
  </Link>

  <Link
    to="/signup"
    className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-xl hover:bg-cyan-400 hover:text-black transition"
  >
    Create Account
  </Link>
</div>
      </div>

      {/* Right */}

      <div className="relative z-10 flex-1 flex justify-center">
        <DashboardPreview />
      </div>
    </motion.section>
  );
}

export default Hero;