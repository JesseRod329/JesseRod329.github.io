import { useEffect, useState } from 'react'
import ProjectRow from '../components/ProjectRow'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    document.title = 'Projects • Sandbox'
    fetch('/src/data/projects.json').then((r) => r.json()).then((d) => setProjects(d.projects))
  }, [])

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl mb-6">Projects</h1>
      <div>
        {projects.map((p) => (
          <ProjectRow key={p.slug} title={p.title} subtitle={p.summary} slug={p.slug} />)
        )}
      </div>
    </div>
  )
}
