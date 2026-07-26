import {
  FaHome,
  FaFilePdf,
  FaRobot,
  FaStickyNote,
  FaQuestionCircle,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaGraduationCap,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  const linkStyle =
    "flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 hover:bg-cyan-500/20 hover:text-cyan-400";

  const activeStyle = ({ isActive }) =>
    `${linkStyle} ${
      isActive
        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
        : "text-slate-300"
    }`;

  return (
    <aside className="w-72 min-h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">

      {/* Logo */}

      <div className="p-8 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="bg-cyan-500 p-3 rounded-xl">

            <FaGraduationCap size={28} className="text-black" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-cyan-400">
              AI Study
            </h1>

            <p className="text-xs text-slate-400">
              Smart Learning
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-5 space-y-3">

      <NavLink to="/dashboard" className={activeStyle}>
  <FaHome />
  Dashboard
</NavLink>

<NavLink to="/upload" className={activeStyle}>
  <FaFilePdf />
  Upload PDF
</NavLink>

      </nav>

      {/* Logout */}

      <div className="p-5 border-t border-white/10">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500 hover:bg-red-400 transition font-semibold"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;