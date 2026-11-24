
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/api";

// Convert Markdown quiz content into an array of questions.
function parseQuiz(content) {
  if (Array.isArray(content)) {
    return content.map((q) => ({
      question: q.question || "",
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer || "",
    }));
  }

  if (typeof content !== "string" || !content.trim()) {
    return [];
  }

  const text = content
    .replace(/```(?:markdown|md)?/gi, "")
    .replace(/```/g, "")
    .trim();

  const lines = text.split("\n");

  // First try to parse a Markdown table.
  const tableLines = lines.filter((line) => line.trim().startsWith("|"));

  if (tableLines.length >= 3) {
    const parseCells = (line) =>
      line.trim().replace(/^\|/, "").replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim().replace(/<br\s*\/?>/gi, "\n"));

    const headers = parseCells(tableLines[0]).map((h) =>
      h.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim()
    );

    const isSeparator = (line) =>
      /^\|?[\s:|-]+\|?$/.test(line.trim());

    const rows = tableLines
      .slice(1)
      .filter((line) => !isSeparator(line));

    const questionIndex = headers.findIndex((h) =>
      h.includes("question")
    );

    const answerIndex = headers.findIndex((h) =>
      h.includes("answer") || h.includes("correct")
    );

    const optionIndexes = headers
      .map((h, index) => ({ h, index }))
      .filter(({ h }) =>
        /^(option|choice)\s*[a-d]$/.test(h) ||
        /^[a-d]$/.test(h)
      );

    if (questionIndex !== -1 && optionIndexes.length > 0) {
      const parsed = rows.map((row) => {
        const cells = parseCells(row);

        const options = optionIndexes
          .map(({ index, h }) => {
            const value = cells[index] || "";
            const letter = h.match(/[a-d]$/)?.[0]?.toUpperCase();
            return value ? `${letter}. ${value}` : "";
          })
          .filter(Boolean);

        const rawAnswer =
          answerIndex !== -1 ? cells[answerIndex] || "" : "";

        let answer = rawAnswer.trim();

        if (/^[a-d]$/i.test(answer)) {
          const letter = answer.toUpperCase();
          answer =
            options.find((option) =>
              option.startsWith(`${letter}.`)
            ) || answer;
        } else if (answer) {
          const letterMatch = answer.match(/^([a-d])[\s.):\-]/i);

          if (letterMatch) {
            const letter = letterMatch[1].toUpperCase();
            answer =
              options.find((option) =>
                option.startsWith(`${letter}.`)
              ) || answer;
          }
        }

        return {
          question: cells[questionIndex] || "",
          options,
          answer,
        };
      }).filter((q) => q.question && q.options.length > 0);

      if (parsed.length > 0) return parsed;
    }
  }

  // Fallback: parse numbered questions and A/B/C/D options.
  const questionBlocks = text.split(
    /(?=^\s*(?:#{1,6}\s*)?(?:question\s*)?\d+\s*[.):]\s+)/im
  );

  const parsed = [];

  for (const block of questionBlocks) {
    const questionMatch = block.match(
      /^\s*(?:#{1,6}\s*)?(?:question\s*)?\d+\s*[.):]\s*(.+)/i
    );

    if (!questionMatch) continue;

    const question = questionMatch[1]
      .replace(/\*\*/g, "")
      .trim();

    const optionMatches = [
      ...block.matchAll(
        /^\s*[-*]?\s*([A-D])[\s.):\-]\s*(.+)$/gim
      ),
    ];

    const options = optionMatches.map((match) =>
      `${match[1].toUpperCase()}. ${match[2].replace(/\*\*/g, "").trim()}`
    );

    const answerMatch = block.match(
      /(?:correct\s*)?answer\s*[:\-]\s*(.+)/i
    );

    let answer = answerMatch
      ? answerMatch[1].replace(/\*\*/g, "").trim()
      : "";

    if (/^[a-d]$/i.test(answer)) {
      const letter = answer.toUpperCase();
      answer =
        options.find((option) => option.startsWith(`${letter}.`)) || answer;
    }

    if (question && options.length > 0) {
      parsed.push({ question, options, answer });
    }
  }

  return parsed;
}

function Quiz() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");
        setAnswers({});
        setSubmitted(false);

        const response = await api.get(`ai/quiz/${id}/`);

        const parsedQuiz = parseQuiz(response.data.quiz);

        if (!parsedQuiz.length) {
          throw new Error(
            "The quiz format could not be understood. Please try generating it again."
          );
        }

        if (active) {
          setTitle(response.data.title || "");
          setQuiz(parsedQuiz);
        }
      } catch (err) {
        console.error("Quiz generation error:", err);

        if (active) {
          setError(
            err.response?.data?.error ||
            err.message ||
            "Unable to generate quiz. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      active = false;
    };
  }, [id]);

  const handleOptionSelect = (questionIndex, option) => {
    if (submitted) return;

    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: option,
    }));
  };

  const calculateScore = () => {
    return quiz.reduce((score, question, index) => {
      const selected = answers[index];
      const correct = question.answer;

      if (!selected || !correct) return score;

      const normalize = (value) =>
        value.replace(/^[A-D][.)]\s*/i, "").trim().toLowerCase();

      return normalize(selected) === normalize(correct)
        ? score + 1
        : score;
    }, 0);
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white">
        AI Quiz Generator
      </h1>

      <p className="text-slate-400 mt-2">
        PDF : <span className="text-cyan-400">{title}</span>
      </p>

      {loading ? (
        <div className="mt-10 text-cyan-400 text-xl animate-pulse">
          Generating Quiz...
        </div>
      ) : error ? (
        <div className="mt-8 bg-red-500/20 border border-red-500 rounded-xl p-6 text-red-300">
          {error}
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {quiz.map((q, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                {index + 1}. {q.question}
              </h2>

              <div className="space-y-4">
                {q.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center gap-3 cursor-pointer text-slate-300"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === option}
                      disabled={submitted}
                      onChange={() =>
                        handleOptionSelect(index, option)
                      }
                      className="accent-cyan-400"
                    />

                    {option}
                  </label>
                ))}
              </div>

              {submitted && (
                <div className="mt-5">
                  {answers[index] &&
                  q.answer &&
                  answers[index].replace(/^[A-D][.)]\s*/i, "").trim().toLowerCase() ===
                    q.answer.replace(/^[A-D][.)]\s*/i, "").trim().toLowerCase() ? (
                    <p className="text-green-400 font-semibold">
                      ✔ Correct
                    </p>
                  ) : (
                    <p className="text-red-400 font-semibold">
                      ✘ Correct Answer: {q.answer || "Not provided"}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length === 0}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-8 py-3 rounded-xl transition"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="bg-green-500/20 border border-green-500 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-green-400">
                Score: {calculateScore()} / {quiz.length}
              </h2>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Quiz;
