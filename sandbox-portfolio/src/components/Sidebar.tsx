import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const linkBase = 'block px-3 py-2 rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2'
const linkActive = 'bg-white/10 text-white'
const linkInactive = 'text-white/70 hover:text-white hover:bg-white/5'

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col justify-between p-4">
      <div>
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-wide">Jesse Rodriguez</h1>
          <p className="text-xs text-white/60">Creative Engineer • Experiments</p>
        </div>
        <nav aria-label="Primary" className="space-y-1">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            Home
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            Projects
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            Info
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            Contact
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            FAQ
          </NavLink>
        </nav>
      </div>
      <div className="space-y-3">
        <ThemeToggle />
        <div className="text-[11px] text-white/50">© {new Date().getFullYear()} Sandbox • @jesse</div>
        <div className="flex gap-3 text-white/60">
          <a href="https://github.com/JesseRod329" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href="#" className="hover:text-white">X</a>
          <a href="#" className="hover:text-white">LinkedIn</a>
        </div>
      </div>
    </div>
  )
}
