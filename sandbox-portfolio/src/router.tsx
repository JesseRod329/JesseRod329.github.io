import { createBrowserRouter, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Sidebar from './components/Sidebar'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Project = lazy(() => import('./pages/Project'))
const Info = lazy(() => import('./pages/Info'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))

function RootLayout() {
  return (
    <div className="min-h-screen flex dark:bg-black">
      <aside className="hidden md:block border-r border-white/10 sidebar-width sticky top-0 h-screen">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0">
        <Suspense fallback={<div className="p-6 text-sm text-white/70">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '/projects', element: <Projects /> },
      { path: '/projects/:slug', element: <Project /> },
      { path: '/info', element: <Info /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faq', element: <FAQ /> },
    ],
  },
])
