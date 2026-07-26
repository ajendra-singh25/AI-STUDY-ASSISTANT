import { FaRobot, FaPlus } from "react-icons/fa";

function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-white/10 p-5">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <FaRobot className="text-cyan-400 text-xl" />
        </div>

        <div>
          <h2 className="font-bold text-lg">
            AI Study Assistant
          </h2>

          <p className="text-green-400 text-sm">
            ● Online
          </p>
        </div>

      </div>

      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition">

        <FaPlus />

        New Chat

      </button>

    </div>
  );
}

export default ChatHeader;