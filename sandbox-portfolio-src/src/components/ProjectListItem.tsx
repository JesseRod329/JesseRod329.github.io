import { Link } from "react-router-dom";
import type { Project } from "../types/project";

interface ProjectListItemProps {
  project: Project;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProjectListItem({ project, onMouseEnter, onMouseLeave }: ProjectListItemProps) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="block p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="text-sm text-text/80">{project.summary}</p>
    </Link>
  );
}