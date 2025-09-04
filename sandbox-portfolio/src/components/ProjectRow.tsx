import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";

type Project = {
  slug: string;
  title: string;
  date: string;
  roles: string[];
  collab?: string;
  thumb?: string;
};

export default function ProjectRow({ project, index }: { project: Project; index: number }) {
  const meta = `${new Date(project.date).toLocaleString("en-US", { month: "short", year: "numeric" })} • ${project.roles.join(", ")}${project.collab ? ` • ${project.collab}` : ""}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.36 }}
      className="group"
    >
      <Link to={`/projects/${project.slug}`} className="block">
        <motion.div
          whileHover={{ x: -2, scale: 1.01, letterSpacing: "0.02em" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="py-8 border-b border-[var(--muted)] last:border-b-0"
        >
          <h2 className="text-4xl font-semibold tracking-tight" style={{ letterSpacing: "-0.01em", lineHeight: 1.05 }}>
            {project.title}
          </h2>
          <motion.p
            className="mt-2 text-sm text-[var(--muted)]"
            whileHover={{ y: -5, opacity: 0.95 }}
            style={{ opacity: 0.6 }}
          >
            {meta}
          </motion.p>
        </motion.div>
      </Link>
    </motion.li>
  );
}