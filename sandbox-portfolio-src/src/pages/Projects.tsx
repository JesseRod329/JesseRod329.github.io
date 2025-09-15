import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  // Filter out hidden projects
  const visibleProjects = projects.filter((p: any) => !p.hidden);
  
  return (
    <main className="min-h-screen">
      <div className="max-w-[900px]">
        {/* Page header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-light neomorphic-text-white mb-4 tracking-tight">
            Projects
          </h1>
          <p className="text-lg neomorphic-text-muted">
            A collection of recent work spanning design, development, and creative exploration.
          </p>
        </div>

        {/* Projects list */}
        <ul className="space-y-8">
          {visibleProjects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </div>
    </main>
  );
}