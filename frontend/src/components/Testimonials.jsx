import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Rahul Sharma",
    role: "B.Tech CSE",
    review:
      "AI Study helped me prepare for semester exams in half the time. The AI notes are amazing!",
  },
  {
    name: "Priya Singh",
    role: "Computer Science Student",
    review:
      "The quiz generator is my favorite feature. It automatically creates practice questions.",
  },
  {
    name: "Aman Verma",
    role: "Final Year Student",
    review:
      "Chat with PDF is incredibly useful. It feels like having a personal tutor available anytime.",
  },
];

function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-32">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl font-bold text-center text-white"
      >
        What Our
        <span className="text-cyan-400"> Students Say</span>
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8 mt-20">

        {reviews.map((review, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            className="
              bg-white/5
              backdrop-blur-xl
              border
              border-cyan-500/20
              rounded-3xl
              p-8
            "
          >

            <div className="flex text-yellow-400 mb-5">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="text-slate-300 leading-8">
              "{review.review}"
            </p>

            <div className="mt-8">
              <h3 className="text-white font-bold text-xl">
                {review.name}
              </h3>

              <p className="text-cyan-400">
                {review.role}
              </p>
            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Testimonials;