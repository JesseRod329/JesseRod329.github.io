// src/pages/Projects.tsx
import React from "react";
import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  return (
    <main className="grid grid-cols-12 gap-8">
      {/* Project list left */}
      <section className="col-span-12 md:col-span-8 lg:col-span-9">
        <ul className="list-none p-0 m-0">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </section>

      {/* Sidebar right */}
      <aside className="hidden md:block md:col-span-4 lg:col-span-3">
        <div className="sticky top-16">
          <h2 className="text-sm uppercase tracking-wider text-muted mb-6">
            Jesse R.
          </h2>
          <p className="text-muted text-sm">
            Designer + Developer.  
            Exploring animation systems, UI experiments, and creative tools.
          </p>
        </div>
      </aside>
    </main>
  );
}