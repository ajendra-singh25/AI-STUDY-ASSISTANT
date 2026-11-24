
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import FlashCard from "../components/FlashCard";
import api from "../api/api";

// Convert the Markdown response into question-answer objects.
function parseFlashcards(content) {
  if (Array.isArray(content)) {
    return content.filter(
      (card) =>
        card &&
        typeof card.question === "string" &&
        typeof card.answer === "string"
    );
  }

  if (typeof content !== "string" || !content.trim()) {
    return [];
  }

  const cards = [];

  const sections = content.split(
    /(?=^#{1,3}\s*Flashcard\s*\d+)/gim
  );

  for (const section of sections) {
    const questionMatch = section.match(
      /\*\*Question:\*\*\s*([\s\S]*?)(?=\*\*Answer:\*\*)/i
    );

    const answerMatch = section.match(
      /\*\*Answer:\*\*\s*([\s\S]*?)$/i
    );

    if (questionMatch && answerMatch) {
      const question = questionMatch[1]
        .replace(/\*\*/g, "")
        .trim();

      const answer = answerMatch[1]
        .replace(/\*\*/g, "")
        .trim();

      if (question && answer) {
        cards.push({ question, answer });
      }
    }
  }

  return cards;
}

function Flashcards() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`ai/flashcards/${id}/`);

        if (!active) return;

        const data = response.data;

        setTitle(data.title || "");

        const parsedCards = parseFlashcards(data.flashcards);

        setFlashcards(parsedCards);
        setCurrent(0);

        if (parsedCards.length === 0) {
          setError(
            "The AI response did not contain readable question-answer pairs. Please try generating flashcards again."
          );
        }
      } catch (err) {
        console.error(
          "Flashcard generation error:",
          err.response?.data || err.message
        );

        if (active) {
          setError(
            err.response?.data?.error ||
            "Unable to generate flashcards. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFlashcards();

    return () => {
      active = false;
    };
  }, [id]);

  const nextCard = () => {
    setCurrent((prev) =>
      Math.min(prev + 1, flashcards.length - 1)
    );
  };

  const previousCard = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold text-white">
          AI Flashcards
        </h1>

        <div className="mt-10 text-cyan-400 text-xl animate-pulse">
          Generating Flashcards...
        </div>
      </DashboardLayout>
    );
  }

  if (error || flashcards.length === 0) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold text-white">
          AI Flashcards
        </h1>

        <p className="text-slate-400 mt-2">
          PDF: {title}
        </p>

        <div className="mt-8 p-5 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400">
            {error || "No flashcards generated."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const card = flashcards[current];

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white">
        AI Flashcards
      </h1>

      <p className="text-slate-400 mt-2">
        PDF: {title}
      </p>

      <p className="text-cyan-400 mt-2">
        Card {current + 1} of {flashcards.length}
      </p>

      <div className="mt-10">
        <FlashCard
          question={card.question}
          answer={card.answer}
        />
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={previousCard}
          disabled={current === 0}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 px-8 py-3 rounded-xl text-white"
        >
          Previous
        </button>

        <button
          onClick={nextCard}
          disabled={current === flashcards.length - 1}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
}

export default Flashcards;
