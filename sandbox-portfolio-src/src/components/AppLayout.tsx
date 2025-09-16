import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="fixed top-0 left-0 right-0 z-10">
        <nav className="w-full p-4">
          <div className="max-w-4xl mx-auto cyber-card p-2">
            <div className="flex justify-between items-center">
              <NavLink to="/" className="text-lg font-bold px-4 cyber-glow">
                Jesse R.
              </NavLink>
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `cyber-button ${isActive ? "bg-accent text-background" : ""}`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `cyber-button ${isActive ? "bg-accent text-background" : ""}`
                  }
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/info"
                  className={({ isActive }) =>
                    `cyber-button ${isActive ? "bg-accent text-background" : ""}`
                  }
                >
                  Info
                </NavLink>
              </div>
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
