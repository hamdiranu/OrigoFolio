<div align="center">
  <h1 align="center">Hamdi Ranuharja — Portfolio</h1>

  <div>
    <img src="https://img.shields.io/badge/-React_19-black?style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/-Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" />
    <img src="https://img.shields.io/badge/-GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </div>

  <p align="center">
    An interactive 3D portfolio site for a front-end engineer with 5+ years of
    experience building React, Vue, and Next.js applications.
  </p>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🗂️ [Project Structure](#structure)
5. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

A personal portfolio site presenting my experience, the products I've shipped,
and the stack I work in. It pairs a conventional content layout with animated
3D scenes rendered through React Three Fiber, and scroll-driven motion via GSAP.

Sections: Hero, Work, Experience, Skills, Education, and Contact.

## <a name="tech-stack">⚙️ Tech Stack</a>

- React 19 + TypeScript
- Vite
- Three.js / React Three Fiber / Drei / postprocessing
- GSAP (with ScrollTrigger)
- Tailwind CSS
- EmailJS (contact form)

## <a name="features">🔋 Features</a>

👉 Animated 3D room and desk scenes with selective bloom lighting

👉 3D tech-stack cards rendered from GLB models

👉 GSAP-powered scroll and timeline animations

👉 Viewport-aware rendering — 3D canvases pause when off-screen

👉 Responsive layout built with Tailwind CSS

👉 Working contact form backed by EmailJS

## <a name="structure">🗂️ Project Structure</a>

```
public/
  images/png/     raster imagery
  images/svg/     icons
  images/logos/   tech logos
  models/         .glb 3D models
src/
  components/     shared UI + three.js scenes
  constants/      all site content (copy, experience, education, links)
  sections/       page sections
  types/          shared TypeScript types
```

Site copy and data live in `src/constants/index.ts` — that's the single place to
edit content.

## <a name="quick-start">🤸 Quick Start</a>

**Prerequisites:** [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en), npm

**Install**

```bash
npm install
```

**Set up environment variables**

Create a `.env` file in the project root:

```env
VITE_APP_EMAILJS_SERVICE_ID=
VITE_APP_EMAILJS_TEMPLATE_ID=
VITE_APP_EMAILJS_PUBLIC_KEY=
```

Replace the placeholders with your **[EmailJS](https://www.emailjs.com/)** credentials.

**Run**

```bash
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run lint     # lint
```

Open [http://localhost:3000](http://localhost:3000/) to view the site.
