import React, { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('site-theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('site-theme','dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('site-theme','light');
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
        className="px-3 py-1 rounded border text-sm"
        style={{ 
          backgroundColor: 'var(--bg)', 
          color: 'var(--fg)', 
          borderColor: 'var(--muted)' 
        }}
      >
        {theme === 'dark' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
}