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
      whileHover={{ scale: 1.01, x: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/projects/${slug}`}
        className="block border-b border-white/10 py-4 group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base tracking-wide group-hover:tracking-wider transition-all">{title}</div>
            <div className="text-xs text-white/60">{subtitle}</div>
          </div>
          <div className="text-white/40 group-hover:text-white/70 transition-colors">→</div>
        </div>
      </Link>
    </motion.div>
  )
}
