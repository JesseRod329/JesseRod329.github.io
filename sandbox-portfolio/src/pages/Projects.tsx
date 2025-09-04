// src/pages/Projects.tsx
import React from "react";
import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  return (
    <main className="grid grid-cols-12">
      {/* Project list */}
      <section className="col-span-12 md:col-span-8 lg:col-span-9">
        <ul className="divide-y divide-muted">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </section>

      {/* Sidebar right */}
      <aside className="hidden md:block md:col-span-4 lg:col-span-3 pl-8">
        <div className="sticky top-20 space-y-4">
          <h2 className="text-xs uppercase tracking-wide text-muted">
            Jesse R.
          </h2>
          <p className="text-sm leading-relaxed text-muted/80">
            Designer + Developer. <br />
            Exploring animation systems, UI experiments, and creative tools.
          </p>
        </div>
      </aside>
    </main>
  );
}