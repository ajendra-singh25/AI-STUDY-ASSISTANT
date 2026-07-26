function SuggestedQuestions({ ask }) {
  const questions = [
    "Summarize this PDF",
    "Explain the important topics",
    "Generate interview questions",
    "Create revision notes",
    "List all formulas",
    "Explain chapter 1",
  ];

  return (
    <div className="mt-8">

      <h2 className="text-white text-xl font-bold mb-4">
        📚 Suggested Questions
      </h2>

      <div className="flex flex-wrap gap-3">

        {questions.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            className="bg-slate-800 hover:bg-cyan-500 hover:text-black transition px-5 py-3 rounded-full text-white"
          >
            {q}
          </button>
        ))}

      </div>

    </div>
  );
}

export default SuggestedQuestions;