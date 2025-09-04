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
    <div className="inline-flex items-center gap-2" role="group" aria-label="Theme">
      <button
        className={`px-2 py-1 rounded text-xs border border-white/10 ${mode === 'dark' ? 'bg-white/10' : 'bg-transparent'}`}
        onClick={() => setMode('dark')}
        aria-pressed={mode === 'dark'}
      >
        Dark
      </button>
      <button
        className={`px-2 py-1 rounded text-xs border border-white/10 ${mode === 'light' ? 'bg-white/10' : 'bg-transparent'}`}
        onClick={() => setMode('light')}
        aria-pressed={mode === 'light'}
      >
        Light
      </button>
      <button
        className={`px-2 py-1 rounded text-xs border border-white/10 ${mode === 'mono' ? 'bg-white/10' : 'bg-transparent'}`}
        onClick={() => setMode('mono')}
        aria-pressed={mode === 'mono'}
      >
        Mono
      </button>
    </div>
  )
}
