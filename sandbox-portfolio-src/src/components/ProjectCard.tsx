import { Link } from "react-router-dom";
import type { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.slug}`} className="block group">
      <div className="p-6 glass-pane group-hover:bg-white/80 dark:group-hover:bg-white/20 transition-colors">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-sm text-text/80">{project.summary}</p>
      </div>
    </Link>
  );
}
