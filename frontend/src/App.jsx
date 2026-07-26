import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadPDF from "./pages/UploadPDF";
import AIChat from "./pages/AIChat";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import History from "./pages/History";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPDF />} />
        <Route path="/chat/:id" element={<AIChat />} />
        <Route path="/notes/:id" element={<Notes />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/flashcards/:id" element={<Flashcards />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;