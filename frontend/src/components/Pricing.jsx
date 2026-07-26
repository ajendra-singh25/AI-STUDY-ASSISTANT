import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for beginners",
    features: [
      "Upload 5 PDFs",
      "Basic AI Notes",
      "Basic Quiz Generator",
      "Community Support",
    ],
    button: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499/mo",
    description: "Most Popular",
    features: [
      "Unlimited PDF Upload",
      "AI Chat",
      "Unlimited Notes",
      "Unlimited Quizzes",
      "Priority Support",
    ],
    button: "Get Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "₹999/mo",
    description: "For Power Users",
    features: [
      "Everything in Pro",
      "Team Workspace",
      "Cloud Sync",
      "AI Flashcards",
      "24/7 Premium Support",
    ],
    button: "Go Premium",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section
  id="pricing"
  className="... scroll-mt-28"
>

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-5xl font-bold text-white"
      >
        Choose Your
        <span className="text-cyan-400"> Plan</span>
      </motion.h2>

      <p className="text-center text-slate-400 mt-5">
        Affordable pricing for every student.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-20">

        {plans.map((plan, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            className={`rounded-3xl p-8 border backdrop-blur-xl transition
            ${
              plan.highlight
                ? "border-cyan-400 bg-cyan-500/10 shadow-2xl shadow-cyan-500/20"
                : "border-white/10 bg-white/5"
            }`}
          >

            {plan.highlight && (
              <div className="mb-5 inline-block rounded-full bg-cyan-500 px-4 py-1 text-black font-semibold">
                Most Popular
              </div>
            )}

            <h3 className="text-3xl font-bold text-white">
              {plan.name}
            </h3>

            <div className="mt-4 text-5xl font-black text-cyan-400">
              {plan.price}
            </div>

            <p className="mt-3 text-slate-300">
              {plan.description}
            </p>

            <div className="mt-8 space-y-4">

              {plan.features.map((feature, i) => (

                <div key={i} className="flex items-center gap-3">

                  <FaCheck className="text-cyan-400" />

                  <span className="text-slate-300">
                    {feature}
                  </span>

                </div>

              ))}

            </div>

            <button
              className={`mt-10 w-full rounded-xl py-3 font-bold transition
              ${
                plan.highlight
                  ? "bg-cyan-500 text-black hover:bg-cyan-400"
                  : "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
              }`}
            >
              {plan.button}
            </button>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Pricing;