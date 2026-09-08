import type {
  Ability,
  CounterItem,
  EducationCard,
  ExpCard,
  NavLink,
  SocialLink,
  TechStackIcon,
  WordItem,
} from "@/types";

const navLinks: NavLink[] = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Education",
    link: "#education",
  },
];

// The hero slider CSS (wordSlider keyframes in index.css) steps in 12.5%
// increments, so this list has to stay at exactly 8 items.
const words: WordItem[] = [
  { text: "Scale Cleanly", imgPath: "/images/svg/code.svg" },
  { text: "Load Fast", imgPath: "/images/svg/zap.svg" },
  { text: "Stay Tested", imgPath: "/images/svg/concepts.svg" },
  { text: "Age Well", imgPath: "/images/svg/sparkle.svg" },
  { text: "Scale Cleanly", imgPath: "/images/svg/code.svg" },
  { text: "Load Fast", imgPath: "/images/svg/zap.svg" },
  { text: "Stay Tested", imgPath: "/images/svg/concepts.svg" },
  { text: "Age Well", imgPath: "/images/svg/sparkle.svg" },
];

const counterItems: CounterItem[] = [
  { value: 5, suffix: "+", label: "Years of Experience" },
  { value: 6, suffix: "", label: "Products Shipped" },
  { value: 80, suffix: "%+", label: "Unit Test Coverage" },
  { value: 3, suffix: "", label: "JS Frameworks Used" },
];

// Marquee of the stack actually used across the Blue Bird Group and Alterra
// work, rather than borrowed client logos.
const techMarquee: string[] = [
  "React.js",
  "TypeScript",
  "Vue.js",
  "Next.js",
  "Vite",
  "Vitest",
  "Nx",
  "Jest",
  "Node.js",
  "Micro Front-Ends",
  "CI/CD",
  "HTML5",
];

const abilities: Ability[] = [
  {
    imgPath: "/images/png/seo.png",
    title: "Front-End Architecture",
    desc: "Structuring micro applications with Nx and Vite so features stay modular, scalable, and quick to build on.",
  },
  {
    imgPath: "/images/png/chat.png",
    title: "JavaScript Framework Depth",
    desc: "Building across the JavaScript ecosystem — React, Vue, Next.js, and Node — and wiring them to back-end services and databases.",
  },
  {
    imgPath: "/images/png/time.png",
    title: "Testing & Delivery",
    desc: "Unit testing with Vitest and Jest past 80% coverage, plus code review and CI/CD to keep releases dependable.",
  },
];

const techStackIcons: TechStackIcon[] = [
  {
    name: "React.js",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  // Both SVG-extruded logos are only ~0.1 units wide, so they need a much
  // larger scale than the other models to match their on-card size.
  {
    name: "TypeScript",
    modelPath: "/models/ts-logo.glb",
    scale: 47,
    rotation: [0, 0, 0],
  },
  {
    name: "Vitest",
    modelPath: "/models/vitest-logo.glb",
    scale: 45,
    rotation: [0, 0, 0],
  },
  {
    name: "Node.js",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Git & CI/CD",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards: ExpCard[] = [
  {
    review:
      "Building micro front-end applications for the Iron Bird logistics side of the business — Operational, Reservation, and Data-Management — on React.js with Nx and Vite.",
    imgPath: "/images/svg/Bluebird_Group_primary_logo.svg.webp",
    logoPath: "/images/png/icon_bluebird.png",
    company: "Blue Bird Group",
    title: "Front-End Engineer",
    date: "October 2023 - Present",
    responsibilities: [
      "Develop micro applications using React.js with Nx and Vite.",
      "Create unit tests with Vitest, holding coverage above 80%.",
      "Conduct code reviews and keep the codebase maintainable, scalable, and high quality.",
    ],
  },
  {
    review:
      "Delivered client-facing products across the Alterra portfolio — Nisaetus, E-Telco, and Solfin — using React.js, Vue.js, and Next.js.",
    imgPath: "/images/png/alterra_indonesia.png",
    // this export carries a wide transparent margin plus a glow, so the mark
    // reads much smaller than Blue Bird's lockup at the same height
    imgHeightClass: "h-24",
    logoPath: "/images/png/alterra_indonesia.png",
    company: "Alterra",
    title: "Front-End Engineer",
    date: "May 2020 - September 2023",
    responsibilities: [
      "Developed web applications with JavaScript frameworks including React.js and Vue.js.",
      "Integrated data from a range of back-end services and databases.",
      "Ensured high performance across both desktop and mobile.",
    ],
  },
];

const educationCards: EducationCard[] = [
  {
    institution: "Universitas Indonesia",
    qualification: "Bachelor of Science",
    date: "2015 - 2019",
    logoPath: "/images/png/Universitas_Indonesia.png",
    logoHeightClass: "h-10",
    review:
      "Where the strong grounding in mathematics comes from — the part of my background that still supports how I reason through logic and problem solving day to day.",
  },
  {
    institution: "Alterra Academy",
    qualification: "Full-Stack Engineer",
    date: "September 2019 - February 2020",
    logoPath: "/images/png/alterra_academy.png",
    // square export whose mark occupies only the middle third; scaled up so it
    // matches the UI logo, with the transparent margin clipped by the chip
    logoHeightClass: "h-28",
    review:
      "An intensive full-stack engineering program that turned those fundamentals into shipping practice and set up the move into front-end engineering.",
  },
];

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    imgPath: "/images/png/linkedin.png",
    url: "https://linkedin.com/in/hamdi-ranuharja",
  },
];

const contactDetails = {
  email: "hamdira@sci.ui.ac.id",
  phone: "+6282133318060",
  linkedin: "linkedin.com/in/hamdi-ranuharja",
  linkedinUrl: "https://linkedin.com/in/hamdi-ranuharja",
  languages: "Indonesian, English",
};

export {
  abilities,
  contactDetails,
  counterItems,
  educationCards,
  expCards,
  navLinks,
  socialLinks,
  techMarquee,
  techStackIcons,
  words,
};
