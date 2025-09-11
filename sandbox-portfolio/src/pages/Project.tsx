import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import projects from "../data/projects.json";
import { motion } from "framer-motion";

export default function Project() {
  const { slug } = useParams();
  // Filter out hidden projects for navigation
  const visibleProjects = projects.filter((p: any) => !p.hidden);
  const index = visibleProjects.findIndex(p => p.slug === slug);
  const project = visibleProjects[index];

  useEffect(() => {
    // prefetch next project
    if (visibleProjects[index + 1]) {
      const next = visibleProjects[index + 1];
      // simple image prefetch - check if gallery exists
      if ('gallery' in next && Array.isArray(next.gallery)) {
        next.gallery.forEach((src: string) => {
          const img = new Image();
          img.src = src;
        });
      }
    }
  }, [index, visibleProjects]);

  if (!project) return <div>Project not found</div>;

  return (
    <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <header className="mb-8">
        <h1 className="text-[clamp(36px,6.2vw,64px)] font-light tracking-[-0.02em] leading-[0.9] text-fg mb-4">
          {project.title}
        </h1>
        <p className="text-muted text-sm">
          {new Date(project.date).toLocaleString("en-US", { month: "short", year: "numeric" })} • {project.roles.join(", ")} • {project.collab}
        </p>
      </header>

      <section className="mb-8">
        <div className="w-full h-[420px] bg-gradient-to-br from-[var(--muted)]/10 to-[var(--muted)]/5 rounded-lg border border-[var(--muted)]/20 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-[var(--fg)]/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[var(--fg)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[var(--fg)] mb-4">Ready to Launch</h2>
          <p className="text-[var(--muted)] mb-8 max-w-md">
            Experience this project live in your browser. Click the launch button below to open the application.
          </p>
          {project.links?.live && (
            <a 
              href={project.links.live} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--fg)] text-[var(--bg)] rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Launch Project</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
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

      <section className="mb-8 flex gap-4">
        {project.links?.repo && (
          <a 
            href={project.links.repo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-[var(--muted)] rounded-md hover:bg-[var(--muted)]/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            View Code
          </a>
        )}
      </section>

      <nav className="flex justify-between mt-12">
        {index > 0 ? <Link to={`/projects/${visibleProjects[index - 1].slug}`} className="text-sm">← Prev</Link> : <div />}
        {index < visibleProjects.length - 1 ? <Link to={`/projects/${visibleProjects[index + 1].slug}`} className="text-sm">Next →</Link> : <div />}
      </nav>
    </motion.article>
  );
}