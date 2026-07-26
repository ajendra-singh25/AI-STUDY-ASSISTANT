import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Is AI Study free to use?",
    answer:
      "Yes! You can start with the Free plan and upgrade whenever you need more features.",
  },
  {
    question: "Can I upload PDF notes?",
    answer:
      "Absolutely. Upload your PDFs and chat with them using AI.",
  },
  {
    question: "Does it generate quizzes automatically?",
    answer:
      "Yes. AI Study generates MCQs and practice quizzes from your study material.",
  },
  {
    question: "Can I access it on mobile?",
    answer:
      "Yes. The website is fully responsive and works on phones, tablets, and desktops.",
  },
];
function FAQ() {

  const [openIndex, setOpenIndex] = useState(null);

  return (

    <section className="max-w-5xl mx-auto px-8 py-32">

      <h2 className="text-5xl font-bold text-center text-white">
        Frequently Asked
        <span className="text-cyan-400"> Questions</span>
      </h2>

      <div className="mt-16 space-y-6">

        {faqs.map((faq, index) => (

          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >

            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex justify-between items-center p-6 text-left"
            >

              <span className="text-xl font-semibold text-white">
                {faq.question}
              </span>

              <span className="text-3xl text-cyan-400">
                {openIndex === index ? "-" : "+"}
              </span>

            </button>

            <AnimatePresence>

              {openIndex === index && (

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >

                  <p className="px-6 pb-6 text-slate-300 leading-8">
                    {faq.answer}
                  </p>

                </motion.div>

              )}

            </AnimatePresence>

          </div>

        ))}

      </div>

    </section>

  );
}

export default FAQ;