import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md">
        <nav className="w-full p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <NavLink to="/" className="text-lg font-semibold">
              Jesse R.
            </NavLink>
            <div className="flex items-center space-x-4">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? "text-accent" : "hover:text-accent"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? "text-accent" : "hover:text-accent"
                  }`
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/info"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? "text-accent" : "hover:text-accent"
                  }`
                }
              >
                Info
              </NavLink>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}