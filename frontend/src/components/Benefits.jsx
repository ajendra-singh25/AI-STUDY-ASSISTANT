import { motion } from "framer-motion";
import {
  FaRobot,
  FaBookOpen,
  FaComments,
  FaChartLine,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaRobot />,
    title: "AI Generated Notes",
    desc: "Convert lengthy PDFs into short and easy-to-read notes.",
  },
  {
    icon: <FaBookOpen />,
    title: "Smart Quiz Generator",
    desc: "Practice automatically generated MCQs and improve faster.",
  },
  {
    icon: <FaComments />,
    title: "Chat with PDFs",
    desc: "Ask questions directly from your uploaded study material.",
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking",
    desc: "Monitor your learning and improve every day.",
  },
];

function Benefits() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-8 py-32">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl font-bold text-center text-white"
      >
        Why Students
        <span className="text-cyan-400"> Love AI Study</span>
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8 mt-20">

        {benefits.map((item, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="
              flex
              gap-5
              items-start
              bg-white/5
              border
              border-cyan-500/20
              rounded-3xl
              p-8
              hover:border-cyan-400
              transition
            "
          >

            <div className="text-cyan-400 text-4xl">
              {item.icon}
            </div>

            <div>

              <h3 className="text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="text-slate-300 mt-2">
                {item.desc}
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Benefits;