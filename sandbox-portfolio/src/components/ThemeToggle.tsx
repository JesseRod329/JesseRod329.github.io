import { useEffect, useState } from "react";

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

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs neomorphic-text-muted font-medium">
        {isDark ? 'Dark' : 'Light'}
      </span>
      <button 
        onClick={() => setTheme(isDark ? 'light' : 'dark')} 
        className="neomorphic-toggle relative w-14 h-7 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <div 
          className={`neomorphic-toggle-thumb w-5 h-5 transition-transform duration-300 ease-out ${
            isDark ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
        
        {/* Theme icons */}
        <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
          {/* Sun icon for light mode */}
          <svg 
            className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-70'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
          
          {/* Moon icon for dark mode */}
          <svg 
            className={`w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-70' : 'opacity-30'}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
}