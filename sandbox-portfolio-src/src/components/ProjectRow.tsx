// src/components/ProjectRow.tsx
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
  // Varying title sizes for visual hierarchy
  const titleSizes = [
    "text-[42px] md:text-[58px]", "text-[38px] md:text-[52px]", "text-[36px] md:text-[48px]", 
    "text-[44px] md:text-[62px]", "text-[34px] md:text-[46px]", "text-[46px] md:text-[64px]"
  ];
  const titleSize = titleSizes[index % titleSizes.length];

  // Floating animation classes with randomization
  const floatClasses = [
    "float-title", "float-title-delayed-1", "float-title-delayed-2",
    "float-title-delayed-3", "float-title-delayed-4", "float-title-delayed-5"
  ];
  const floatClass = floatClasses[index % floatClasses.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group relative mb-16"
    >
      <Link to={`/projects/${project.slug}`} className="block no-underline">
        <div className="neomorphic-card p-8 md:p-12 cursor-pointer">
          {/* Project title with RGB glowing engraved effect */}
          <div className="relative mb-6">
            <h2 className={`${titleSize} ${floatClass} font-light tracking-[-0.02em] neomorphic-title-engraved neomorphic-rgb-glow leading-[0.9] mb-4`}>
              {project.title}
            </h2>
          </div>

          {/* Role tags with neumorphic styling */}
          <div className="flex flex-wrap gap-3 mb-6">
            {project.roles.map((role, roleIndex) => (
              <span 
                key={roleIndex}
                className="neomorphic-raised-subtle px-4 py-2 text-sm neomorphic-text-muted font-medium"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Meta information */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="text-sm neomorphic-text-muted">
              {new Date(project.date).toLocaleString("en-US", { month: "short", year: "numeric" })}
            </div>
            {project.collab && (
              <div className="text-sm neomorphic-text-muted">
                {project.collab}
              </div>
            )}
          </div>

        </div>
      </Link>
    </motion.li>
  );
}