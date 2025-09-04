import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

interface Project {
  slug: string
  title: string
  summary: string
  stack: string[]
  images: string[]
  repo?: string
  live?: string
}

export default function Project() {
  const params = useParams()
  const slug = params.slug!
  const [data, setData] = useState<{ projects: Project[] } | null>(null)

  useEffect(() => {
    fetch('/src/data/projects.json').then((r) => r.json()).then((d) => setData(d))
  }, [])

  const project = useMemo(() => data?.projects.find((p) => p.slug === slug), [data, slug])
  const index = useMemo(() => (data ? data.projects.findIndex((p) => p.slug === slug) : -1), [data, slug])
  const prev = index > 0 ? data!.projects[index - 1] : null
  const next = data && index >= 0 && index < data.projects.length - 1 ? data.projects[index + 1] : null

  useEffect(() => {
    if (next) {
      // Prefetch next project's images
      next.images?.forEach((src) => {
        const img = new Image()
        img.src = src
      })
    }
    if (project) document.title = `${project.title} • Sandbox`
  }, [project, next])

  if (!project) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 md:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <p className="text-white/70 text-sm">{project.summary}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {project.images.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" className="rounded-md border border-white/10" />
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-sm uppercase tracking-wider text-white/60 mb-2">Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="px-2 py-1 rounded-full text-xs border border-white/15 text-white/80">{s}</span>
          ))}
        </div>
      </section>

      <section className="flex gap-3 mb-8">
        {project.repo && (
          <a className="px-3 py-2 rounded border border-white/15 text-sm" href={project.repo} target="_blank" rel="noreferrer">Repository</a>
        )}
        {project.live && (
          <a className="px-3 py-2 rounded border border-white/15 text-sm" href={project.live} target="_blank" rel="noreferrer">Live</a>
        )}
      </section>

      <nav className="flex justify-between text-sm text-white/70">
        <div>
          {prev && (
            <Link to={`/projects/${prev.slug}`} rel="prev" className="hover:text-white">← {prev.title}</Link>
          )}
        </div>
        <div>
          {next && (
            <Link to={`/projects/${next.slug}`} rel="next" className="hover:text-white">{next.title} →</Link>
          )}
        </div>
      </nav>
    </div>
  )
}
