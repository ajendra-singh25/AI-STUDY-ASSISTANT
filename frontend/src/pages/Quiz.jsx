import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/api";

function Quiz() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`ai/quiz/${id}/`);

      setTitle(response.data.title);
      setQuiz(response.data.quiz);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleOptionSelect = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const calculateScore = () => {
    let score = 0;

    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score++;
      }
    });

    return score;
  };

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-white">
        AI Quiz Generator
      </h1>

      <p className="text-slate-400 mt-2">
        PDF : {title}
      </p>

      {loading ? (

        <div className="mt-10 text-cyan-400 text-xl animate-pulse">
          Generating Quiz...
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

                {q.options.map((option, i) => (

                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer text-slate-300"
                  >

                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === option}
                      onChange={() =>
                        handleOptionSelect(index, option)
                      }
                    />

                    {option}

                  </label>

                ))}

              </div>

              {submitted && (

                <div className="mt-5">

                  {answers[index] === q.answer ? (

                    <p className="text-green-400 font-semibold">
                      ✔ Correct
                    </p>

                  ) : (

                    <p className="text-red-400 font-semibold">
                      ✘ Correct Answer: {q.answer}
                    </p>

                  )}

                </div>

              )}

            </div>

          ))}

          {!submitted ? (

            <button
              onClick={() => setSubmitted(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl transition"
            >
              Submit Quiz
            </button>

          ) : (

            <div className="bg-green-500/20 border border-green-500 rounded-3xl p-8">

              <h2 className="text-3xl font-bold text-green-400">
                Score : {calculateScore()} / {quiz.length}
              </h2>

            </div>

          )}

        </div>

      )}

    </DashboardLayout>
  );
}

export default Quiz;