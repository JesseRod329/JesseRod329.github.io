// src/components/ProjectRow.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Project = {
  slug: string;
  title: string;
  date: string;
  roles: string[];
  collab?: string;
};

export default function ProjectRow({ project, index }: { project: Project; index: number }) {
  const meta = `${new Date(project.date).toLocaleString("en-US", { month: "short", year: "numeric" })} / ${project.roles.join(" / ")}${project.collab ? `: ${project.collab}` : ""}`;

  // Varying title sizes like the reference
  const titleSizes = [
    "text-[72px]", "text-[58px]", "text-[52px]", 
    "text-[68px]", "text-[48px]", "text-[72px]"
  ];
  const titleSize = titleSizes[index % titleSizes.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group relative mb-20"
    >
      <Link to={`/projects/${project.slug}`} className="block no-underline">
        <motion.div
          whileHover={{ x: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <h2 className={`${titleSize} font-light tracking-[-0.02em] mb-2 text-fg leading-[0.9]`}>
            {project.title}
          </h2>
          <div className="text-xs text-muted font-normal text-right mt-5">
            {meta}
          </div>
        </motion.div>
      </Link>
    </motion.li>
  );
}