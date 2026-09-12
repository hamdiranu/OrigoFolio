import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import LiveDemoButton from "@/components/LiveDemoButton";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);
  const eTelcoRef = useRef<HTMLDivElement>(null);
  const sipRekRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 });

    // Animations for each app showcase
    const cards = [storeRef.current, eTelcoRef.current, sipRekRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={storeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <img
                src="/images/png/dummyjson-store-hero-showcase.png"
                alt="DummyJSON Store dashboard"
              />
            </div>
            <div className="text-content">
              <h2>
                A Mini E-Commerce Platform with a Fully Interactive Analytics
                Dashboard — DummyJSON Store
              </h2>
              <p className="text-white-50 md:text-xl">
                Built with Vue.js, Vite, and TypeScript. Surfaces product counts,
                user activity, cart status, and revenue, with bar and pie charts
                for category distribution — alongside browsing, cart, and
                checkout flows.
              </p>
              <LiveDemoButton
                href="https://hamdi-dummy-store.netlify.app"
                label="View the DummyJSON Store live demo"
              />
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={eTelcoRef}>
              <div className="image-wrapper">
                <img
                  src="/images/png/etelco-showcase-v2.png"
                  alt="E-Telco procurement platform"
                />
              </div>
              <h2>E-Telco — Telco Procurement, Digitised End to End</h2>
            </div>

            <div className="project" ref={sipRekRef}>
              <div className="image-wrapper">
                <img
                  src="/images/png/siprek-showcase-v2.png"
                  alt="SIP-Rek advertisement tax information system"
                />
              </div>
              <h2>SIP-Rek! — Advertisement Tax Information System</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
