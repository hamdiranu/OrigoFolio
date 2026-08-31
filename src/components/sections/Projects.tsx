import { projects } from '../../data/projects'

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <p className="section-label">
          <span className="index">03.</span> Projects
        </p>
        <div className="project-list">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <div className="project-card-header">
                <h3>{project.title}</h3>
                <div className="project-links">
                  {project.repo && (
                    <a href={project.repo} aria-label={`${project.title} repository`}>
                      Code
                    </a>
                  )}
                  {project.link && (
                    <a href={project.link} aria-label={`${project.title} live demo`}>
                      Live
                    </a>
                  )}
                </div>
              </div>
              <p>{project.description}</p>
              <ul className="project-tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
