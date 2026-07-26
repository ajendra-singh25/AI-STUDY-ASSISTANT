import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/api";

import {
  FaTrash,
  FaPaperPlane,
  FaDownload,
} from "react-icons/fa";

import ChatMessage from "../components/chat/ChatMessage";
import SuggestedQuestions from "../components/chat/SuggestedQuestions";
import TypingLoader from "../components/chat/TypingLoader";

function AIChat() {
  const { id } = useParams();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
  inputRef.current?.focus();
}, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
const askQuestion = async (customQuestion = null) => {
  const userQuestion =
    typeof customQuestion === "string"
      ? customQuestion
      : question;

  if (!userQuestion.trim()) return;

  // Add user message immediately
  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: userQuestion,
    },
  ]);

  setQuestion("");
  setLoading(true);

  try {
    const response = await api.get(
      `ai/search/${id}/?q=${encodeURIComponent(userQuestion)}`
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: response.data.answer,
        sources: response.data.sources || [],
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "Unable to reach AI server.",
        sources: [],
      },
    ]);
  } finally {
    setLoading(false);
  }
};
 const askSuggestedQuestion = (q) => {
  askQuestion(q);
};
const downloadChat = () => {
  const content = messages
    .map(
      (m) =>
        `${m.role === "user" ? "You" : "AI"}:\n${m.text}\n`
    )
    .join("\n-----------------------\n");

  const blob = new Blob([content], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "AI_Chat.txt";

  a.click();

  URL.revokeObjectURL(url);
};
console.log("Messages state:", messages);

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white">
        AI Study Assistant
      </h1>
      <div className="flex justify-between items-center mt-3">

  <p className="text-slate-400">
    Ask anything from your uploaded PDF.
  </p>

 {messages.length > 0 && (
  <div className="flex gap-3">

    <button
      onClick={downloadChat}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-xl"
    >
      <FaDownload />
      Download
    </button>

    <button
      onClick={() => setMessages([])}
      className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl"
    >
      <FaTrash />
      Clear Chat
    </button>

  </div>
)}

</div>

      <div className="mt-8 bg-white/5 rounded-3xl border border-white/10 p-6">

        <div className="h-[550px] overflow-y-auto space-y-6">
         {messages.length === 0 && (
  <div className="text-center py-20">

    <h2 className="text-3xl text-white font-bold">
      🤖 AI Study Assistant
    </h2>

    <p className="text-slate-400 mt-4">
      Ask anything from your uploaded PDF.
    </p>

    <SuggestedQuestions
      ask={askSuggestedQuestion}
    />

  </div>
)}

          {messages.map((msg, index) => (
  <ChatMessage
    key={index}
    msg={msg}
  />
))}

          {loading && <TypingLoader />}

          <div ref={bottomRef}></div>

        </div>

        <div className="mt-6">

  <div className="flex gap-4">

    <input
      ref={inputRef}
      maxLength={500}
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={(e) => {

  if (e.key === "Enter" && !e.shiftKey) {

    e.preventDefault();

    askQuestion();

  }

}}
      placeholder="Ask anything..."
      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-5 py-4 text-white outline-none"
    />

  <button
  onClick={askQuestion}
  disabled={loading}
  className={`px-8 py-3 rounded-xl font-bold transition ${
    loading
      ? "bg-slate-600 cursor-not-allowed"
      : "bg-cyan-500 hover:bg-cyan-400 text-black"
  }`}
>
  {loading ? "Thinking..." : (
    <div className="flex items-center gap-2">
      <FaPaperPlane />
      Send
    </div>
  )}
</button>  

  </div>

  <p className="text-right mt-2 text-slate-500 text-sm">
    {question.length}/500
  </p>

</div>

      </div>

    </DashboardLayout>
  );
}

export default AIChat;