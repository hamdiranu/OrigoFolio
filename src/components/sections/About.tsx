import { useReveal } from '../../hooks/useReveal'
import { IconCheck } from '../common/icons'

const highlights = [
  'Component-driven React & TypeScript apps',
  'Real-time 3D scenes with Three.js / R3F',
  'Custom GLSL shaders & post-processing',
  'Performance-minded, accessible UI',
]

export default function About() {
  const [ref, visible] = useReveal<HTMLDivElement>()

  return (
    <section id="about">
      <div className="container">
        <p className="section-label">
          <span className="index">01</span> About Me
        </p>
        <div ref={ref} className={`about-grid reveal ${visible ? 'in-view' : ''}`}>
          <div className="about-text">
            <p>
              I'm a frontend engineer focused on building fast, accessible web interfaces —
              and, where it fits, pushing them into three dimensions. I enjoy the moment a
              flat UI turns into something you can orbit, light, and touch.
            </p>
            <p>
              My day-to-day toolkit is React and TypeScript. For anything that calls for
              depth, motion, or a bit of spectacle, I reach for Three.js and React Three
              Fiber — building scenes that stay performant on real devices, not just demo
              machines.
            </p>
            <p>
              Outside of 3D work, I care about clean component architecture, thoughtful
              animation, and interfaces that feel considered rather than assembled.
            </p>
          </div>
          <div className="about-panel">
            <p className="about-panel-title">Focus areas</p>
            <ul className="about-highlights">
              {highlights.map((item) => (
                <li key={item}>
                  <IconCheck className="check-icon" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
