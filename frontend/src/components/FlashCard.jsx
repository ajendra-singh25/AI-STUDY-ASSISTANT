import { useState } from "react";
import { motion } from "framer-motion";

function FlashCard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full flex justify-center"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          transformStyle: "preserve-3d",
          width: "700px",
          height: "350px",
        }}
        className="relative cursor-pointer"
      >
        {/* Front */}
        <div
          className="absolute w-full h-full rounded-3xl bg-slate-800 border border-cyan-500 flex flex-col items-center justify-center p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h2 className="text-cyan-400 text-3xl font-bold">
            Question
          </h2>

          <p className="text-white text-xl mt-8 text-center">
            {question}
          </p>

          <p className="text-slate-400 mt-8">
            Click to reveal answer
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full rounded-3xl bg-green-700 border border-green-400 flex flex-col items-center justify-center p-8"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <h2 className="text-white text-3xl font-bold">
            Answer
          </h2>

          <p className="text-white text-xl mt-8 text-center">
            {answer}
          </p>

          <p className="mt-8 text-green-200">
            Click to go back
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default FlashCard;