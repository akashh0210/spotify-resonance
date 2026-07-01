/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#121212',
        'bg-card': '#181818',
        'bg-card-hover': '#282828',
        'bg-elevated': '#242424',
        'accent': '#1DB954',
        'accent-hover': '#1ED760',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B3B3B3',
        'text-subdued': '#6A6A6A',
        'border-spotify': '#282828',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
