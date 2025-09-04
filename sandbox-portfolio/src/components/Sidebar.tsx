import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const linkBase = 'block py-1 text-base font-normal transition-colors duration-300 relative'
const linkActive = 'text-fg'
const linkInactive = 'text-muted hover:text-fg'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[200px] p-10 bg-white/10 border-r border-black/10 fixed h-screen z-10 flex flex-col justify-between">
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

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white/95 dark:bg-black/95 backdrop-blur-sm border-r border-black/10 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-light mb-1 text-fg leading-tight">
                  Jesse R.
                </h1>
                <span className="text-sm font-normal text-fg opacity-70">
                  Designer & Developer
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Primary" className="space-y-4">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-4 text-fg">•</span>}
                    Home
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/projects" 
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-4 text-fg">•</span>}
                    Projects
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/info" 
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-4 text-fg">•</span>}
                    Info
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                onClick={onClose}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute -left-4 text-fg">•</span>}
                    Contact
                  </>
                )}
              </NavLink>
              <NavLink 
                to="/faq" 
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                onClick={onClose}
              >
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
      </div>
    </>
  )
}
