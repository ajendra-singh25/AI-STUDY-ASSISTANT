import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Background from "../components/Background";
import MouseGlow from "../components/MouseGlow";

function Home() {
  return (
    <div className="relative overflow-hidden bg-[#030712] text-white min-h-screen">
      <Background />
      <MouseGlow />

      <Navbar />

      <Hero />

      <section id="features">
        <Features />
      </section>

      <Benefits />

      <Testimonials />

      <section id="pricing">
        <Pricing />
      </section>

      <section id="about">
        <FAQ />
      </section>

      <Footer />
    </div>
  );
}

export default Home;