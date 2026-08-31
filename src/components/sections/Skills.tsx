import { skillGroups, type SkillGroup } from '../../data/skills'
import { useReveal } from '../../hooks/useReveal'
import { IconLayers, IconCode, IconSparkle, IconGear } from '../common/icons'
import type { ComponentType } from 'react'
import type { SVGProps } from 'react'

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  '3D & Graphics': IconLayers,
  Frontend: IconCode,
  'Motion & Interaction': IconSparkle,
  Tooling: IconGear,
}

function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const [ref, visible] = useReveal<HTMLDivElement>()
  const Icon = icons[group.category] ?? IconCode

  return (
    <div
      ref={ref}
      className={`skill-card reveal ${visible ? 'in-view' : ''}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="skill-icon">
        <Icon />
      </div>
      <h3>{group.category}</h3>
      <ul className="skill-tags">
        {group.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <p className="section-label">
          <span className="index">02</span> Skills
        </p>
        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <SkillCard key={group.category} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
