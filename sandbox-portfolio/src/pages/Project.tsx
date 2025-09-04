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
        <div className="w-full h-[420px] bg-[var(--muted)]/20 rounded-md overflow-hidden flex items-center justify-center">
          {/* gallery placeholder - show first image or placeholder */}
          {project.gallery && project.gallery[0] ? (
            <img 
              src={project.gallery[0]} 
              alt={project.title} 
              loading="lazy" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="flex flex-col items-center justify-center text-[var(--muted)] text-center p-8" style={{ display: project.gallery && project.gallery[0] ? 'none' : 'flex' }}>
            <div className="w-16 h-16 bg-[var(--muted)]/30 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">Project Preview</p>
            <p className="text-xs opacity-60 mt-1">Image coming soon</p>
          </div>
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