import { useEffect, useState } from 'react'

type ThemeMode = 'dark' | 'light' | 'mono'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const classList = root.classList
  classList.remove('dark', 'light', 'mono')
  classList.add(mode)
  if (mode === 'mono') {
    root.classList.add('mono')
  }
  localStorage.setItem('theme', mode)
}

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem('theme') as ThemeMode | null
  if (saved) return saved
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  return (
    <div className="space-y-1" role="group" aria-label="Theme">
      <div className="text-xs text-gray-500 dark:text-gray-400 font-light">Theme</div>
      <div className="space-y-1">
        <button
          className={`block text-xs font-light ${mode === 'light' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setMode('light')}
          aria-pressed={mode === 'light'}
        >
          LIGHT
        </button>
        <button
          className={`block text-xs font-light ${mode === 'dark' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setMode('dark')}
          aria-pressed={mode === 'dark'}
        >
          DARK
        </button>
        <button
          className={`block text-xs font-light ${mode === 'mono' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setMode('mono')}
          aria-pressed={mode === 'mono'}
        >
          MONOSPACED
        </button>
      </div>
    </div>
  )
}
