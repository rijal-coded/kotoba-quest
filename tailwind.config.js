/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind utility classes to CSS variables defined in index.css
        main: 'var(--main)',
        accent: 'var(--accent)',
        // Common aliases
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        // Additional mappings used in codebase (compound names)
        'bg-bg-primary': 'var(--bg-primary)',
        'bg-bg-surface': 'var(--bg-surface)',
        'text-text-primary': 'var(--text-primary)',
        'text-text-secondary': 'var(--text-secondary)',
        // Neon colors
        'neon-pink': '#D946EF',
        'neon-blue': '#3B82F6',
        'neon-red': '#EF4444',
      }
    }
  }
}
