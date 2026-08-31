import { skillGroups } from '../../data/skills'

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <p className="section-label">
          <span className="index">02.</span> Skills
        </p>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div key={group.category} className="skill-card">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
