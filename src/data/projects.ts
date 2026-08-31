export interface Project {
  title: string
  description: string
  tags: string[]
  link?: string
  repo?: string
}

export const projects: Project[] = [
  {
    title: 'Interactive Product Configurator',
    description:
      'A real-time 3D product configurator built with React Three Fiber — swap materials, colors, and camera angles with physically based rendering.',
    tags: ['React Three Fiber', 'Three.js', 'TypeScript'],
    link: '#',
    repo: '#',
  },
  {
    title: 'Generative Shader Playground',
    description:
      'A GLSL shader sandbox for experimenting with noise fields, raymarching, and post-processing effects, rendered live in the browser.',
    tags: ['GLSL', 'WebGL', 'Vite'],
    link: '#',
    repo: '#',
  },
  {
    title: 'Data-Driven 3D Dashboard',
    description:
      'An analytics dashboard that maps live data into an animated 3D scene, blending drei helpers with custom shader materials.',
    tags: ['React Three Fiber', 'drei', 'Next.js'],
    link: '#',
    repo: '#',
  },
]
