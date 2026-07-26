import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("accounts/register/", formData);

      console.log(response.data);

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.log(error.response?.data);

      setMessage("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden">

      <div className="absolute w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[180px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-[450px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 shadow-2xl"
      >

        <h1 className="text-4xl font-bold text-center text-white">
          Create Account
        </h1>

        <p className="text-center text-slate-300 mt-3">
          Start learning with AI today.
        </p>

        {/* Username */}

        <div className="mt-8 relative">
          <FaUser className="absolute left-4 top-4 text-cyan-400" />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Email */}

        <div className="mt-5 relative">
          <FaEnvelope className="absolute left-4 top-4 text-cyan-400" />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Password */}

        <div className="mt-5 relative">
          <FaLock className="absolute left-4 top-4 text-cyan-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-cyan-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {message && (
          <p className="text-center mt-5 text-cyan-400 font-semibold">
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition hover:scale-105"
        >
          Create Account
        </button>

        <p className="text-center text-slate-300 mt-6">
          Already have an account?

          <Link
            to="/login"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Login
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

export default Signup;