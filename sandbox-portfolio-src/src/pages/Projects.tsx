import { useState } from "react";
import projects from "../data/projects.json";
import ProjectListItem from "../components/ProjectListItem";
import type { Project } from "../types/project";
import { AnimatePresence, motion } from "framer-motion";

export default function Projects() {
  const visibleProjects: Project[] = (projects as Project[]).filter((p: Project) => !p.hidden);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(visibleProjects[0] || null);

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
        <div className="relative">
          <AnimatePresence>
            {hoveredProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="sticky top-24"
              >
                <div className="clean-card overflow-hidden">
                  <img
                    src={hoveredProject.image}
                    alt={hoveredProject.title}
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          {visibleProjects.map((p) => (
            <ProjectListItem
              key={p.slug}
              project={p}
              onMouseEnter={() => setHoveredProject(p)}
              onMouseLeave={() => setHoveredProject(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}