import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const linkBase = 'block px-4 py-3 text-sm font-light focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg transition-all duration-200'
const linkActive = 'font-medium'
const linkInactive = 'hover:opacity-80'

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col justify-between p-6">
      <div>
        <div className="mb-16">
          <h1 className="text-3xl font-light tracking-tight leading-tight" style={{ color: 'var(--fg)' }}>Jesse Rodriguez</h1>
          <p className="text-sm font-light mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>Creative Engineer • Experiments</p>
        </div>
        <nav aria-label="Primary" className="space-y-1">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`} style={{ color: 'var(--fg)' }}>
            Home
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`} style={{ color: 'var(--fg)' }}>
            Projects
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`} style={{ color: 'var(--fg)' }}>
            Info
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`} style={{ color: 'var(--fg)' }}>
            Contact
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`} style={{ color: 'var(--fg)' }}>
            FAQ
          </NavLink>
        </nav>
      </div>
      <div className="space-y-4">
        <ThemeToggle />
        <div className="text-xs" style={{ color: 'var(--muted)' }}>© {new Date().getFullYear()} Sandbox</div>
      </div>
    </div>
  )
}
