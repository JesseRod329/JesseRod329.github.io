import projects from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../types/project";

export default function Projects() {
  // Filter out hidden projects
  const visibleProjects: Project[] = projects.filter((p: Project) => !p.hidden);
  
  return (
    <div>
      <header className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Projects
        </h1>
        <p className="text-lg text-text/80">
          A selection of my recent work.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
