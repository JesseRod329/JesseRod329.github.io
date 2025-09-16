import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import projects from "../data/projects.json";
import { motion } from "framer-motion";
import type { Project as ProjectType } from "../types/project";

export default function Project() {
  const { slug } = useParams();
  // Filter out hidden projects for navigation
  const visibleProjects: ProjectType[] = (projects as ProjectType[]).filter((p: ProjectType) => !p.hidden);
  const index = visibleProjects.findIndex(p => p.slug === slug);
  const project: ProjectType = visibleProjects[index];

  useEffect(() => {
    // prefetch next project
    if (visibleProjects[index + 1]) {
      const next = visibleProjects[index + 1];
      // simple image prefetch - check if gallery exists
      if (next.gallery && Array.isArray(next.gallery)) {
        next.gallery.forEach((src: string) => {
          const img = new Image();
          img.src = src;
        });
      }
    }
  }, [index, visibleProjects]);

  if (!project) return <div>Project not found</div>;

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <header className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          {project.title}
        </h1>
        <p className="text-lg text-text/80">
          {new Date(project.date).toLocaleString("en-US", { month: "long", year: "numeric" })}
        </p>
      </header>

      <div className="glass-pane p-8 md:p-12">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <p className="text-text/80 max-w-prose">{project.summary}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack?.map(s => (
              <span key={s} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section className="flex gap-4">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-accent text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Live Demo
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              View Code
            </a>
          )}
        </section>
      </div>

      <nav className="flex justify-between mt-12">
        {index > 0 ? (
          <Link to={`/projects/${visibleProjects[index - 1].slug}`} className="text-sm hover:text-accent transition-colors">
            ← Previous Project
          </Link>
        ) : <div />}
        {index < visibleProjects.length - 1 ? (
          <Link to={`/projects/${visibleProjects[index + 1].slug}`} className="text-sm hover:text-accent transition-colors">
            Next Project →
          </Link>
        ) : <div />}
      </nav>
    </motion.article>
  );
}