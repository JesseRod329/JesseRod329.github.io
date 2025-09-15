module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        'surface-elevated': "var(--surface-elevated)",
        'surface-depressed': "var(--surface-depressed)",
        'surface-hover': "var(--surface-hover)",
        'surface-active': "var(--surface-active)",
        accent: "var(--accent)",
        'accent-muted': "var(--accent-muted)",
      },
      boxShadow: {
        'neomorphic': '8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)',
        'neomorphic-sm': '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)',
        'neomorphic-lg': '12px 12px 24px var(--shadow-dark), -12px -12px 24px var(--shadow-light)',
        'neomorphic-inset': 'inset 4px 4px 8px var(--shadow-inset-dark), inset -4px -4px 8px var(--shadow-inset-light)',
        'neomorphic-button': '6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      },
    },
  },
  plugins: [],
}