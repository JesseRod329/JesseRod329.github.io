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
  const meta = `${new Date(project.date).toLocaleString("en-US", { month: "short", year: "numeric" })} • ${project.roles.join(", ")}${project.collab ? ` • ${project.collab}` : ""}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group"
    >
      <Link to={`/projects/${project.slug}`} className="block no-underline">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="py-12"
        >
          <h2 className="text-[clamp(28px,4vw,44px)] font-light leading-tight text-fg transition-colors group-hover:text-fg/90">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-muted/70 group-hover:text-muted transition-colors">
            {meta}
          </p>
        </motion.div>
      </Link>
    </motion.li>
  );
}