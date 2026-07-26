import ReactMarkdown from "react-markdown";
import {
  FaRobot,
  FaUser,
  FaCopy,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

function ChatMessage({ msg }) {
   console.log("Rendering ChatMessage:", msg);
  const isUser = msg.role === "user";

  const copyMessage = () => {
    navigator.clipboard.writeText(msg.text);
  };

  return (
    <div
      className={`flex mb-8 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="mr-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
            <FaRobot className="text-black" />
          </div>
        </div>
      )}

      <div
        className={`max-w-4xl rounded-3xl p-6 shadow-xl ${
          isUser
            ? "bg-cyan-500 text-black"
            : "bg-slate-800 border border-white/10 text-white"
        }`}
      >
        {/* Message */}

        <div className="prose prose-invert max-w-none">
  <ReactMarkdown>
    {msg.text}
  </ReactMarkdown>
</div>

        {/* Source */}

        {!isUser && msg.sources?.length > 0 && (
          <details className="mt-5">
            <summary className="cursor-pointer text-cyan-400 font-semibold">
              📄 View PDF Source
            </summary>

            <div className="mt-3 bg-black/30 border border-cyan-500/20 rounded-xl p-4 whitespace-pre-wrap text-sm text-slate-300">
              {msg.sources[0]}
            </div>
          </details>
        )}

        {/* Toolbar */}

        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4">
            <button
              onClick={copyMessage}
              className="hover:text-cyan-400 transition"
            >
              <FaCopy />
            </button>

            {!isUser && (
              <>
                <button className="hover:text-green-400 transition">
                  <FaThumbsUp />
                </button>

                <button className="hover:text-red-400 transition">
                  <FaThumbsDown />
                </button>
              </>
            )}
          </div>

          <span className="text-xs text-slate-400">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {isUser && (
        <div className="ml-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
            <FaUser className="text-black" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;