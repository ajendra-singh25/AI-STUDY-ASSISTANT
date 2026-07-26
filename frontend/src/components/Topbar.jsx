import {
  FaBell,
  FaSearch,
  FaMoon,
  FaUserCircle,
} from "react-icons/fa";

function Topbar() {
  return (
    <header
      className="
        h-20
        border-b
        border-white/10
        bg-white/5
        backdrop-blur-xl
        flex
        items-center
        justify-between
        px-8
      "
    >
      {/* Search Bar */}

      <div className="relative w-[420px]">

        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Search notes, PDFs, quizzes..."
          className="
            w-full
            bg-[#111827]
            border
            border-white/10
            rounded-xl
            pl-12
            pr-4
            py-3
            text-white
            placeholder-slate-400
            outline-none
            focus:border-cyan-400
            transition
          "
        />

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-6">

        <button
          className="
            w-12
            h-12
            rounded-xl
            bg-white/5
            hover:bg-cyan-500/20
            transition
            flex
            items-center
            justify-center
          "
        >
          <FaMoon className="text-cyan-400 text-xl" />
        </button>

        <button
          className="
            relative
            w-12
            h-12
            rounded-xl
            bg-white/5
            hover:bg-cyan-500/20
            transition
            flex
            items-center
            justify-center
          "
        >
          <FaBell className="text-cyan-400 text-xl" />

          <span
            className="
              absolute
              top-2
              right-2
              w-2.5
              h-2.5
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3">

          <FaUserCircle
            className="text-cyan-400"
            size={42}
          />

          <div>

            <h2 className="font-semibold text-white">
              Welcome
            </h2>

            <p className="text-sm text-slate-400">
              Student
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;