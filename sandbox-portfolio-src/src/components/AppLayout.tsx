import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 neomorphic-sidebar border-b border-white/5 nav-safe" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-xl font-light neomorphic-text-white tracking-tight">
                Jesse R.
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `neomorphic-nav-link px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive ? 'neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/info"
                  className={({ isActive }) =>
                    `neomorphic-nav-link px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive ? 'neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'
                    }`
                  }
                >
                  Info
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `neomorphic-nav-link px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive ? 'neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="neomorphic-mobile-button p-2 neomorphic-text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/5">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `block neomorphic-nav-link px-3 py-2 text-base font-medium transition-all duration-300 ${
                      isActive ? 'neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/info"
                  className={({ isActive }) =>
                    `block neomorphic-nav-link px-3 py-2 text-base font-medium transition-all duration-300 ${
                      isActive ? 'neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Info
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block neomorphic-nav-link px-3 py-2 text-base font-medium transition-all duration-300 ${
                      isActive ? 'neomorphic-text-white' : 'neomorphic-text-muted hover:neomorphic-text-white'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="safe-content">
        <Outlet />
      </main>
    </div>
  );
}
