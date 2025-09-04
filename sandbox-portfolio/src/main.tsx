import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import Alpine from 'alpinejs'

// Initialize Alpine.js
window.Alpine = Alpine
Alpine.start()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

