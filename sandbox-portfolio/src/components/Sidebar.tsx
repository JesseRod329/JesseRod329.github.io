import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[200px] p-8 neomorphic-sidebar fixed h-screen z-10 flex flex-col justify-between">
        <div>
          <div className="mb-12">
            <h1 className="text-[28px] font-light mb-3 neomorphic-text-white leading-tight tracking-tight">
              Jesse R.
            </h1>
            <span className="text-sm font-normal neomorphic-text-muted">
              Designer & Developer
            </span>
          </div>
          <nav aria-label="Primary" className="space-y-2">
            <NavLink to="/" end className={({ isActive }) => 
              `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
            }>
              {({ isActive }) => (
                <div className="flex items-center">
                  {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                  <span className={isActive ? 'ml-3' : ''}>Home</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => 
              `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
            }>
              {({ isActive }) => (
                <div className="flex items-center">
                  {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                  <span className={isActive ? 'ml-3' : ''}>Projects</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/info" className={({ isActive }) => 
              `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
            }>
              {({ isActive }) => (
                <div className="flex items-center">
                  {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                  <span className={isActive ? 'ml-3' : ''}>Info</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => 
              `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
            }>
              {({ isActive }) => (
                <div className="flex items-center">
                  {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                  <span className={isActive ? 'ml-3' : ''}>Contact</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => 
              `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
            }>
              {({ isActive }) => (
                <div className="flex items-center">
                  {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                  <span className={isActive ? 'ml-3' : ''}>FAQ</span>
                </div>
              )}
            </NavLink>
          </nav>
        </div>
        <div className="space-y-6">
          <div className="text-xs neomorphic-text-muted">© Jesse R.</div>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] neomorphic-sidebar z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-light mb-1 neomorphic-text-white leading-tight">
                  Jesse R.
                </h1>
                <span className="text-sm font-normal neomorphic-text-muted">
                  Designer & Developer
                </span>
              </div>
              <button
                onClick={onClose}
                className="neomorphic-mobile-button p-3 neomorphic-text-white"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Primary" className="space-y-3">
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => 
                  `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
                }
                onClick={onClose}
              >
                {({ isActive }) => (
                  <div className="flex items-center">
                    {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                    <span className={isActive ? 'ml-3' : ''}>Home</span>
                  </div>
                )}
              </NavLink>
              <NavLink 
                to="/projects" 
                className={({ isActive }) => 
                  `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
                }
                onClick={onClose}
              >
                {({ isActive }) => (
                  <div className="flex items-center">
                    {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                    <span className={isActive ? 'ml-3' : ''}>Projects</span>
                  </div>
                )}
              </NavLink>
              <NavLink 
                to="/info" 
                className={({ isActive }) => 
                  `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
                }
                onClick={onClose}
              >
                {({ isActive }) => (
                  <div className="flex items-center">
                    {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                    <span className={isActive ? 'ml-3' : ''}>Info</span>
                  </div>
                )}
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
                }
                onClick={onClose}
              >
                {({ isActive }) => (
                  <div className="flex items-center">
                    {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                    <span className={isActive ? 'ml-3' : ''}>Contact</span>
                  </div>
                )}
              </NavLink>
              <NavLink 
                to="/faq" 
                className={({ isActive }) => 
                  `neomorphic-nav-link block text-base font-normal transition-all duration-300 relative ${isActive ? 'active neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'}`
                }
                onClick={onClose}
              >
                {({ isActive }) => (
                  <div className="flex items-center">
                    {isActive && <span className="absolute -left-2 text-accent text-lg">•</span>}
                    <span className={isActive ? 'ml-3' : ''}>FAQ</span>
                  </div>
                )}
              </NavLink>
            </nav>
          </div>
          <div className="space-y-4">
            <div className="text-xs neomorphic-text-muted">© Jesse R.</div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
