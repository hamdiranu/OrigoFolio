import HeroScene from '../three/HeroScene'

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-canvas">
        <HeroScene />
      </div>
      <div className="container hero-content">
        <p className="hero-eyebrow">Hi, my name is</p>
        <h1 className="hero-name">Hamdi Ranuharja.</h1>
        <h2 className="hero-tagline">I build immersive interfaces for the web.</h2>
        <p className="hero-summary">
          I'm a frontend engineer who specializes in blending React with real-time 3D — crafting
          interactive experiences using Three.js and React Three Fiber.
        </p>
        <a className="hero-cta" href="#projects">
          View my work
        </a>
      </div>
    </section>
  )
}
