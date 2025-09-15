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
  // Mobile-friendly title sizes
  const titleSizes = [
    "text-[24px] sm:text-[32px] md:text-[42px] lg:text-[58px]", 
    "text-[22px] sm:text-[30px] md:text-[38px] lg:text-[52px]", 
    "text-[23px] sm:text-[31px] md:text-[36px] lg:text-[48px]", 
    "text-[25px] sm:text-[33px] md:text-[44px] lg:text-[62px]", 
    "text-[21px] sm:text-[29px] md:text-[34px] lg:text-[46px]", 
    "text-[26px] sm:text-[34px] md:text-[46px] lg:text-[64px]"
  ];
  const titleSize = titleSizes[index % titleSizes.length];

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group relative"
    >
      <Link to={`/projects/${project.slug}`} className="block no-underline">
        <div className="neomorphic-card p-6 sm:p-8 md:p-12 cursor-pointer">
          {/* Clean project title without floating */}
          <div className="relative">
            <h2 className={`${titleSize} font-light tracking-[-0.02em] neomorphic-title-engraved leading-[0.9]`}>
              {project.title}
            </h2>
          </div>

        </div>
      </Link>
    </motion.li>
  );
}