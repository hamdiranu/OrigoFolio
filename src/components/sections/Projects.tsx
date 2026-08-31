import { projects, type Project } from '../../data/projects'
import { useReveal } from '../../hooks/useReveal'
import { IconArrowUpRight, IconCode } from '../common/icons'

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [ref, visible] = useReveal<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`project-row reveal ${visible ? 'in-view' : ''}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="project-visual" aria-hidden="true">
        <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="project-links">
          {project.repo && (
            <a href={project.repo} aria-label={`${project.title} repository`}>
              <IconCode className="link-icon" />
              Code
            </a>
          )}
          {project.link && (
            <a href={project.link} aria-label={`${project.title} live demo`}>
              Live
              <IconArrowUpRight className="link-icon" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <p className="section-label">
          <span className="index">03</span> Projects
        </p>
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectRow key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
