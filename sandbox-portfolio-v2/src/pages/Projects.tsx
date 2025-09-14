import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  // Filter out hidden projects
  const visibleProjects = projects.filter((p: any) => !p.hidden);
  
  return (
    <main>
      <div className="grid grid-cols-1 gap-20 max-w-[900px]">
        {visibleProjects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </main>
  );
}