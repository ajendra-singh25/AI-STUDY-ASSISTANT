import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 bg-white/5 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">

        {/* Logo */}

        <div>
          <h2 className="text-3xl font-bold text-cyan-400">
            AI Study
          </h2>

          <p className="mt-4 text-slate-300">
            Your intelligent study companion powered by Artificial Intelligence.
          </p>
        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-white font-bold text-xl">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3 text-slate-300">

            <li className="hover:text-cyan-400 cursor-pointer">
              Home
            </li>

            <li className="hover:text-cyan-400 cursor-pointer">
              Features
            </li>

            <li className="hover:text-cyan-400 cursor-pointer">
              Pricing
            </li>

            <li className="hover:text-cyan-400 cursor-pointer">
              FAQ
            </li>

          </ul>

        </div>

        {/* Features */}

        <div>

          <h3 className="text-white font-bold text-xl">
            Features
          </h3>

          <ul className="mt-5 space-y-3 text-slate-300">

            <li>AI Notes</li>
            <li>AI Chat</li>
            <li>Quiz Generator</li>
            <li>Progress Tracking</li>

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-white font-bold text-xl">
            Contact
          </h3>

          <div className="flex gap-5 mt-6 text-2xl text-cyan-400">

            <FaGithub className="hover:scale-125 transition cursor-pointer"/>

            <FaLinkedin className="hover:scale-125 transition cursor-pointer"/>

            <FaInstagram className="hover:scale-125 transition cursor-pointer"/>

            <FaEnvelope className="hover:scale-125 transition cursor-pointer"/>

          </div>

        </div>

      </div>

      <div className="border-t border-white/10 text-center py-6 text-slate-400">

        © 2026 AI Study Assistant. All Rights Reserved.

      </div>

    </footer>
  );
}

export default Footer;