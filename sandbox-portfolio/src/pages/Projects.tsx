// src/pages/Projects.tsx
import React from "react";
import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  return (
    <section>
      <ul className="list-none p-0 m-0">
        {projects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </ul>
    </section>
  );
}