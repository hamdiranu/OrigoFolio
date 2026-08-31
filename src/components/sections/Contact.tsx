import { useReveal } from '../../hooks/useReveal'

const links = [
  { label: 'Email', href: 'mailto:hamdiranuharjaa@gmail.com' },
  { label: 'GitHub', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

export default function Contact() {
  const [ref, visible] = useReveal<HTMLDivElement>()

  return (
    <section id="contact">
      <div className="container">
        <p className="section-label">
          <span className="index">04</span> Contact
        </p>
        <div ref={ref} className={`contact-panel reveal ${visible ? 'in-view' : ''}`}>
          <h2>Let's build something.</h2>
          <p className="contact-copy">
            I'm currently open to frontend and creative-development roles. Whether you have a
            project in mind or just want to say hi, my inbox is open.
          </p>
          <a className="hero-cta" href="mailto:hamdiranuharjaa@gmail.com">
            Say hello
          </a>
          <ul className="contact-links">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
