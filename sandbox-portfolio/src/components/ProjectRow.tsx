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
        className="block py-4 px-2 -mx-2 rounded-lg transition-all duration-200 hover:opacity-80"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xl font-light tracking-tight group-hover:tracking-normal transition-all duration-200 truncate" style={{ color: 'var(--fg)' }}>
              {title}
            </div>
            <div className="text-sm font-light mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {subtitle}
            </div>
          </div>
          <div className="ml-4 transition-colors duration-200 text-lg" style={{ color: 'var(--muted)' }}>
            →
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
