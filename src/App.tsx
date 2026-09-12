import { TempleNightScene } from "@designcodeio/threeui";

import NavBar from "@/components/NavBar";
import { useTempleScroll } from "@/hooks/useTempleScroll";
import Contact from "@/sections/Contact";
import Education from "@/sections/Education";
import Experience from "@/sections/Experience";
import FeatureCards from "@/sections/FeatureCards";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import LogoShowcase from "@/sections/LogoShowcase";
import ShowcaseSection from "@/sections/ShowcaseSection";
import TechStack from "@/sections/TechStack";

const App = () => {
  // scroll flies the backdrop's camera along its waypoint spline
  useTempleScroll();

  return (
    <>
      {/* Kage temple world, pinned behind the page. It pauses itself when
          off-screen or backgrounded and honours prefers-reduced-motion. */}
      <div className="site-background" aria-hidden="true">
        <TempleNightScene />
        <div className="site-background__scrim" />
      </div>

      <div className="site-content">
        <NavBar />
        <Hero />
        <ShowcaseSection />
        <LogoShowcase />
        <FeatureCards />
        <Experience />
        <TechStack />
        <Education />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default App;
