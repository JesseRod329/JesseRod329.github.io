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
      whileHover={{ x: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/projects/${slug}`}
        className="block py-3 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-thin tracking-wide text-gray-900 dark:text-white group-hover:tracking-wider transition-all">{title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-light">{subtitle}</div>
          </div>
          <div className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">→</div>
        </div>
      </Link>
    </motion.div>
  )
}
