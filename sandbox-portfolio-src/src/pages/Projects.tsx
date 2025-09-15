import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  // Filter out hidden projects
  const visibleProjects = projects.filter((p: any) => !p.hidden);
  
  return (
    <main className="min-h-screen px-4 sm:px-6 md:px-8">
      <div className="max-w-[900px] w-full">
        {/* Page header */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light neomorphic-text-white mb-3 sm:mb-4 tracking-tight">
            Projects
          </h1>
          <p className="text-base sm:text-lg neomorphic-text-muted">
            A collection of recent work spanning design, development, and creative exploration.
          </p>
        </div>

        {/* Projects list */}
        <ul className="space-y-4 sm:space-y-6 md:space-y-8">
          {visibleProjects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </div>
    </main>
  );
}