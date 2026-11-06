/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#142720',
          green: '#203d32',
          'green-light': '#2e5747',
          terracotta: '#d97736',
          'terracotta-hover': '#c46324',
          cream: '#fbf8f3',
          'cream-card': '#f5eee3',
          'cream-border': '#e6dccb',
          charcoal: '#1c2421',
          muted: '#66736c',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
