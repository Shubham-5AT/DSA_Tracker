/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: {
            light: '#FAFAF8',
            dark: '#1A1917',
          },
          text: {
            light: '#2B2A27',
            dark: '#E6E4DD',
          },
          muted: {
            light: '#737169',
            dark: '#A6A49C',
          },
          border: {
            light: 'rgba(0, 0, 0, 0.08)',
            dark: 'rgba(255, 255, 255, 0.08)',
          }
        },
        accent: {
          DEFAULT: '#2B4C7E',
          hover: '#1F395F',
          light: 'rgba(43, 76, 126, 0.08)',
          darkHover: '#3D6299',
        },
        badge: {
          easy: {
            text: '#4A6D55',
            bgLight: '#F0F4F1',
            bgDark: '#26362C',
            borderLight: 'rgba(74, 109, 85, 0.2)',
            borderDark: 'rgba(74, 109, 85, 0.3)',
          },
          medium: {
            text: '#A8703C',
            bgLight: '#FAF5F0',
            bgDark: '#3D2D1E',
            borderLight: 'rgba(168, 112, 60, 0.2)',
            borderDark: 'rgba(168, 112, 60, 0.3)',
          },
          hard: {
            text: '#B34E45',
            bgLight: '#FAF1F0',
            bgDark: '#402422',
            borderLight: 'rgba(179, 78, 69, 0.2)',
            borderDark: 'rgba(179, 78, 69, 0.3)',
          }
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.04)',
        hover: '0 4px 12px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
