function TypingLoader() {
  return (
    <div className="flex gap-2 px-4 py-3">

      <span className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"></span>

      <span
        className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>

      <span
        className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>

    </div>
  );
}

export default TypingLoader;