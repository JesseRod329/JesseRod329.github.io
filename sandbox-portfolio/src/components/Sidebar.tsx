import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const linkBase = 'block py-1 text-base font-normal transition-colors duration-300 relative'
const linkActive = 'text-fg'
const linkInactive = 'text-muted hover:text-fg'

export default function Sidebar() {
  return (
    <div className="w-[200px] p-10 bg-white/10 border-r border-black/10 fixed h-screen z-10 flex flex-col justify-between">
      <div>
        <div className="mb-10">
          <h1 className="text-[28px] font-light mb-2 text-fg leading-tight">
            Jesse R.
          </h1>
          <span className="text-sm font-normal text-fg opacity-70">
            Designer & Developer
          </span>
        </div>
        <nav aria-label="Primary" className="space-y-5">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-4 text-fg">•</span>}
                Home
              </>
            )}
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-4 text-fg">•</span>}
                Projects
              </>
            )}
          </NavLink>
          <NavLink to="/info" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-4 text-fg">•</span>}
                Info
              </>
            )}
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-4 text-fg">•</span>}
                Contact
              </>
            )}
          </NavLink>
          <NavLink to="/faq" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-4 text-fg">•</span>}
                FAQ
              </>
            )}
          </NavLink>
        </nav>
      </div>
      <div className="space-y-4">
        <div className="text-xs text-muted">© Jesse R.</div>
        <ThemeToggle />
      </div>
    </div>
  )
}
