# OrigoFolio

A personal portfolio showcasing my work, experience, projects, and journey in software engineering. Built with React and a Three.js-powered hero scene.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and bundling
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei) for the animated hero background
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting

## Project structure

```
src/
  components/
    layout/     # Nav, Footer
    sections/   # Hero, About, Skills, Projects, Contact
    three/      # HeroScene (animated 3D background)
  data/         # skills.ts, projects.ts — content used by sections
  App.tsx
  main.tsx
```

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

## Scripts

| Command           | Description                        |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Start the Vite dev server           |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build        |
| `npm run lint`      | Run oxlint                          |
