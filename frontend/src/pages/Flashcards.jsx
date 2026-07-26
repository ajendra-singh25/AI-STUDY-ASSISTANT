import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import FlashCard from "../components/FlashCard";
import api from "../api/api";

function Flashcards() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await api.get(`ai/flashcards/${id}/`);

      console.log(response.data);

      setTitle(response.data.title);
      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (current < flashcards.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  const previousCard = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
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

  if (flashcards.length === 0) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold text-white">
          AI Flashcards
        </h1>

        <p className="text-red-400 mt-8">
          No flashcards generated.
        </p>
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
        PDF : {title}
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