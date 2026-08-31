export interface SkillGroup {
  category: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: '3D & Graphics',
    items: ['Three.js', 'React Three Fiber', 'drei', 'WebGL', 'GLSL Shaders'],
  },
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS'],
  },
  {
    category: 'Motion & Interaction',
    items: ['GSAP', 'Framer Motion', 'CSS Animations'],
  },
  {
    category: 'Tooling',
    items: ['Git', 'Figma', 'Vercel', 'Node.js'],
  },
]
