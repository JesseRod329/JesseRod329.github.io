import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="fixed top-0 left-0 right-0 z-10">
        <nav className="w-full p-4">
          <div className="max-w-4xl mx-auto glass-pane p-2 rounded-full">
            <div className="flex justify-between items-center">
              <NavLink to="/" className="text-lg font-semibold px-4">
                Jesse R.
              </NavLink>
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      isActive ? "bg-accent text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      isActive ? "bg-accent text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/info"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      isActive ? "bg-accent text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`
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