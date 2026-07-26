import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
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
      const response = await api.post("accounts/login/", formData);

      // Save JWT tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      setMessage("Login Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.log(error.response?.data);
      setMessage("Invalid Username or Password");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden">

      <div className="absolute w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[180px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-[420px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 shadow-2xl"
      >

        <h1 className="text-4xl font-bold text-center text-white">
          Welcome Back
        </h1>

        <p className="text-center text-slate-300 mt-3">
          Login to continue your learning journey.
        </p>

        {/* Username */}

        <div className="mt-8 relative">

          <FaEnvelope className="absolute left-4 top-4 text-cyan-400" />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
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
          Login
        </button>

        <p className="text-center text-slate-300 mt-6">

          Don't have an account?

          <Link
            to="/signup"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </motion.div>

    </div>
  );
}

export default Login;