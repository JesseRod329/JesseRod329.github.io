import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const linkBase = 'block px-4 py-3 text-sm font-light focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg transition-all duration-200'
const linkActive = 'text-gray-900 dark:text-white bg-white/10 dark:bg-black/10'
const linkInactive = 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 dark:hover:bg-black/5'

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col justify-between p-6">
      <div>
        <div className="mb-16">
          <h1 className="text-3xl font-light tracking-tight text-gray-900 dark:text-white leading-tight">Jesse Rodriguez</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-2 leading-relaxed">Creative Engineer • Experiments</p>
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
      <div className="space-y-4">
        <ThemeToggle />
        <div className="text-xs text-gray-400 dark:text-gray-500">© {new Date().getFullYear()} Sandbox</div>
      </div>
    </div>
  )
}
