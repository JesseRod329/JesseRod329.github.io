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
          whileHover={{ x: -2, letterSpacing: "0.02em" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="py-12 border-b border-muted last:border-b-0"
        >
          <h2 className="text-[clamp(28px,4vw,48px)] font-light tracking-tight leading-[1.05] text-fg group-hover:text-fg transition-colors">
            {project.title}
          </h2>
          <motion.p
            className="mt-2 text-sm text-muted"
            whileHover={{ y: -4, opacity: 0.8 }}
            style={{ opacity: 0.6 }}
          >
            {meta}
          </motion.p>
        </motion.div>
      </Link>
    </motion.li>
  );
}