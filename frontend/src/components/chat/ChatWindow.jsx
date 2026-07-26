import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
function ChatWindow() {
    const messages = [
  {
    sender: "ai",
    text: "Hello! Upload your notes and I'll help you study."
  },
  {
    sender: "user",
    text: "Summarize Chapter 4."
  },
  {
    sender: "ai",
    text: "Chapter 4 explains normalization in DBMS..."
  }
];
  return (
    <div
      className="
        w-full
        max-w-5xl
        h-[700px]
        mx-auto
        rounded-3xl
        overflow-hidden
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-2xl
      "
    >

      <ChatHeader />

      <div className="flex-1 p-6">

      <div className="p-6 space-y-2 overflow-y-auto h-[600px]">

  {messages.map((message, index) => (

    <ChatMessage
      key={index}
      sender={message.sender}
      text={message.text}
    />

  ))}

</div>

      </div>

    </div>
  );
}

export default ChatWindow;