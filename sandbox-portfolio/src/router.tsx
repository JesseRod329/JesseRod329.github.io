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
    <div className="min-h-screen flex bg-white dark:bg-black">
      <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 sticky top-0 h-screen">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0 noise-bg vignette">
        <Suspense fallback={<div className="p-6 text-sm text-gray-600 dark:text-gray-300">Loading…</div>}>
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
