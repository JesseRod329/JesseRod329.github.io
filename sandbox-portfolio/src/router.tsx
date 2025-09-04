import { createBrowserRouter, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Sidebar from './components/Sidebar'
import ThreeBackground from './components/ThreeBackground'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Project = lazy(() => import('./pages/Project'))
const Info = lazy(() => import('./pages/Info'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))

function RootLayout() {
  return (
    <div className="min-h-screen flex relative" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <ThreeBackground />
      <aside className="w-64 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 sticky top-0 h-screen z-10" style={{ backgroundColor: 'var(--bg)' }}>
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0 relative z-10">
        <Suspense fallback={<div className="p-6 text-sm" style={{ color: 'var(--muted)' }}>Loading…</div>}>
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
