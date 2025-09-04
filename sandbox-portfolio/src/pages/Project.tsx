import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import projects from "../data/projects.json";
import { motion } from "framer-motion";

export default function Project() {
  const { slug } = useParams();
  const index = projects.findIndex(p => p.slug === slug);
  const project = projects[index];

  useEffect(() => {
    // prefetch next project
    if (projects[index + 1]) {
      const next = projects[index + 1];
      // simple image prefetch
      next.gallery?.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [index]);

  if (!project) return <div>Project not found</div>;

  return (
    <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <header className="mb-8">
        <h1 className="text-5xl font-extralight">{project.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {new Date(project.date).toLocaleString("en-US", { month: "short", year: "numeric" })} • {project.roles.join(", ")} • {project.collab}
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4">
        <div className="w-full h-[420px] bg-[var(--muted)] rounded-md overflow-hidden">
          {/* gallery placeholder - show first image */}
          {project.gallery && project.gallery[0] && (
            <img src={project.gallery[0]} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
          )}
        </div>
      </section>

      <section className="mb-8">
        <p className="max-w-[70ch]">{project.summary}</p>
      </section>

      <section className="mb-8 flex gap-2 flex-wrap">
        {project.stack?.map(s => (
          <span key={s} className="px-3 py-1 text-sm text-[var(--muted)] border border-[var(--muted)] rounded-md">
            {s}
          </span>
        ))}
      </section>

      <nav className="flex justify-between mt-12">
        {index > 0 ? <Link to={`/projects/${projects[index - 1].slug}`} className="text-sm">← Prev</Link> : <div />}
        {index < projects.length - 1 ? <Link to={`/projects/${projects[index + 1].slug}`} className="text-sm">Next →</Link> : <div />}
      </nav>
    </motion.article>
  );
}