import type { ReactNode } from "react";

import { navLinks } from "@/constants";
import { useTopDock } from "@/hooks/useTopDock";

// 16x16 line icons matching the dock's stroke style — the stylesheet paints
// them via `stroke: currentColor`, so they inherit the item's lit/dim state.
const icons: Record<string, ReactNode> = {
  Work: (
    <>
      <rect x="2.2" y="4.8" width="11.6" height="8.4" rx="1.6" />
      <path d="M5.8 4.8V3.6a1.2 1.2 0 0 1 1.2-1.2h2a1.2 1.2 0 0 1 1.2 1.2v1.2M2.2 8.4h11.6" />
    </>
  ),
  Experience: (
    <>
      <circle cx="8" cy="8" r="5.9" />
      <path d="M8 4.6V8l2.4 1.5" />
    </>
  ),
  Skills: (
    <>
      <path d="M8 1.9 14.4 5.6 8 9.3 1.6 5.6z" />
      <path d="m2.6 8 5.4 3.1L13.4 8M2.6 10.7 8 13.8l5.4-3.1" />
    </>
  ),
  Education: (
    <>
      <path d="M1.8 5.9 8 3l6.2 2.9L8 8.8z" />
      <path d="M4.4 7.2v3.4c0 .9 1.6 1.8 3.6 1.8s3.6-.9 3.6-1.8V7.2" />
    </>
  ),
};

const NavBar = () => {
  const dockRef = useTopDock<HTMLElement>();

  return (
    <div className="navbar-dock animated-top-dock-component atd-modern">
      <header className="atd-modern__bar">
        <a className="atd-modern__brand" href="#hero">
          <span className="atd-modern__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect width="24" height="24" rx="12" fill="#e8e8e3" />
              <text
                x="12"
                y="16.2"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#111"
              >
                HR
              </text>
            </svg>
          </span>
          <span className="atd-modern__word">Hamdi Ranuharja</span>
        </a>

        <nav ref={dockRef} className="atd-modern__dock" aria-label="Primary">
          {navLinks.map(({ name, link }) => (
            <a
              key={name}
              className="atd-modern__item"
              data-dock-item
              href={link}
            >
              <span className="atd-modern__icon" aria-hidden="true">
                <svg viewBox="0 0 16 16">{icons[name]}</svg>
              </span>
              <span>{name}</span>
            </a>
          ))}
        </nav>

        <div className="atd-modern__actions">
          <a className="atd-modern__cta" href="#contact">
            <span>Contact me</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 8h9.1M8.6 4.3 12.4 8l-3.8 3.7" />
            </svg>
          </a>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
