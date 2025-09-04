import React from "react";
import projects from "../data/projects.json";
import ProjectRow from "../components/ProjectRow";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="projects"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35 }}
      >
        <ul className="list-none p-0 m-0">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ul>
      </motion.section>
    </AnimatePresence>
  );
}