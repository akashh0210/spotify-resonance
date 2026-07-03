/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#121212',
        'bg-card':       '#181818',
        'bg-card-hover': '#282828',
        'bg-elevated':   '#242424',
        'bg-sidebar':    '#121212',
        'accent':        '#1DB954',
        'accent-hover':  '#1ED760',
        'text-primary':  '#FFFFFF',
        'text-secondary':'#B3B3B3',
        'text-subdued':  '#6A6A6A',
        'border-spotify':'#282828',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.25)', opacity: '0.5' },
          '50%':       { transform: 'scaleY(1)',    opacity: '1'   },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition:  '400px 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)'   },
        },
      },
      animation: {
        waveform: 'waveform 1.2s ease-in-out infinite',
        shimmer:  'shimmer 1.6s ease-in-out infinite',
        fadeIn:   'fadeIn 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
