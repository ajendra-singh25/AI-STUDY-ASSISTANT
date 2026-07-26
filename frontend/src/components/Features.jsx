import { FaRobot, FaFilePdf, FaClipboardCheck } from "react-icons/fa";
import FeatureCard from "./FeatureCard";

function Features() {
  return (
   <section
  id="features"
  className="max-w-7xl mx-auto px-8 py-20 scroll-mt-28"
>

      <h1 className="text-5xl font-bold text-white text-center">
  Powerful <span className="text-cyan-400">AI Features</span>
</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">

        <FeatureCard
          icon={<FaFilePdf />}
          title="Upload PDFs"
          description="Upload your notes and let AI understand them."
        />

        <FeatureCard
          icon={<FaRobot />}
          title="AI Chat"
          description="Ask questions from your study material instantly."
        />

        <FeatureCard
          icon={<FaClipboardCheck />}
          title="Quiz Generator"
          description="Generate quizzes automatically from your notes."
        />

      </div>

    </section>
  );
}

export default Features;