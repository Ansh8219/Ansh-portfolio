/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nvs-primary': '#ff6b00',
        'nvs-secondary': '#1a1a1a',
        'nvs-accent': '#ff6b00',
        'nvs-grey': '#6b7280',
        'nvs-light-grey': '#f3f4f6',
        'nvs-dark': '#0a0a0a',
        'nvs-orange': '#ff6b00',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 107, 0, 0.5)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 107, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

