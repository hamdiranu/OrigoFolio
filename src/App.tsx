import NavBar from "@/components/NavBar";
import Contact from "@/sections/Contact";
import Education from "@/sections/Education";
import Experience from "@/sections/Experience";
import FeatureCards from "@/sections/FeatureCards";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import LogoShowcase from "@/sections/LogoShowcase";
import ShowcaseSection from "@/sections/ShowcaseSection";
import TechStack from "@/sections/TechStack";

const App = () => (
  <>
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
  </>
);

export default App;
