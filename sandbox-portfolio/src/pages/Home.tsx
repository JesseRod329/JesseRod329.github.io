import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectRow from '../components/ProjectRow'
import NoiseBackground from '../components/NoiseBackground'

interface ProjectMeta { title: string; subtitle: string; slug: string }

export default function Home() {
  const [projects, setProjects] = useState<ProjectMeta[]>([])

  useEffect(() => {
    fetch('/src/data/projects.json')
      .then((r) => r.json())
      .then((data) => {
        document.title = 'Home • Sandbox Portfolio'
        setProjects(data.projects.map((p: any) => ({ title: p.title, subtitle: p.summary, slug: p.slug })))
      })
  }, [])

  return (
    <div className="p-8 min-h-screen">
      <div className="space-y-1">
        {projects.map((p, idx) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.04 }}
          >
            <ProjectRow title={p.title} subtitle={p.subtitle} slug={p.slug} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
