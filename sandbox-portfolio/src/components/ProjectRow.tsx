import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ProjectRow({
  title,
  subtitle,
  slug,
}: {
  title: string
  subtitle: string
  slug: string
}) {
  return (
    <motion.div
      whileHover={{ 
        x: -2,
        scale: 1.01,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group"
    >
      <Link
        to={`/projects/${slug}`}
        className="block py-4 px-2 -mx-2 rounded-lg transition-all duration-200 hover:bg-white/5 dark:hover:bg-black/5"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xl font-light tracking-tight text-gray-900 dark:text-white group-hover:tracking-normal transition-all duration-200 truncate">
              {title}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-light mt-1 leading-relaxed">
              {subtitle}
            </div>
          </div>
          <div className="ml-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 text-lg">
            →
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
