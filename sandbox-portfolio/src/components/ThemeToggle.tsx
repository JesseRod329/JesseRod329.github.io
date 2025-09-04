import { useEffect, useState } from 'react'

type ThemeMode = 'dark' | 'light' | 'mono'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const classList = root.classList
  classList.remove('dark', 'light', 'mono')
  classList.add(mode)
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
    <div className="space-y-2" role="group" aria-label="Theme">
      <div className="text-xs font-light" style={{ color: 'var(--muted)' }}>Theme</div>
      <div className="space-y-1">
        <button
          className={`block text-xs font-light px-2 py-1 rounded transition-colors ${
            mode === 'light' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
          }`}
          style={{ color: 'var(--fg)' }}
          onClick={() => setMode('light')}
          aria-pressed={mode === 'light'}
        >
          LIGHT
        </button>
        <button
          className={`block text-xs font-light px-2 py-1 rounded transition-colors ${
            mode === 'dark' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
          }`}
          style={{ color: 'var(--fg)' }}
          onClick={() => setMode('dark')}
          aria-pressed={mode === 'dark'}
        >
          DARK
        </button>
        <button
          className={`block text-xs font-light px-2 py-1 rounded transition-colors ${
            mode === 'mono' ? 'opacity-100' : 'opacity-60 hover:opacity-80'
          }`}
          style={{ color: 'var(--fg)' }}
          onClick={() => setMode('mono')}
          aria-pressed={mode === 'mono'}
        >
          MONOSPACED
        </button>
      </div>
    </div>
  )
}
