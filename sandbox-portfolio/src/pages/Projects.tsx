import React from "react";
import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";

export default function Projects() {
  return (
    <main>
      <div className="grid grid-cols-1 gap-20 max-w-[900px]">
        {projects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </main>
  );
}