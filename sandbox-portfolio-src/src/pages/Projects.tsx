import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  // Filter out hidden projects
  const visibleProjects = projects.filter((p: any) => !p.hidden);
  
  return (
    <main className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 safe-content-sm">
      <div className="max-w-[900px] w-full mx-auto">
        {/* Page header */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light neomorphic-text-white mb-4 sm:mb-6 tracking-tight">
            Projects
          </h1>
          <p className="text-base sm:text-lg neomorphic-text-muted max-w-[600px]">
            Recent work in design and development.
          </p>
        </div>

        {/* Projects list */}
        <ul className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
          {visibleProjects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </div>
    </main>
  );
}