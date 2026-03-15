/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0A0A0F',
          900: '#111118',
          800: '#1C1C27',
          700: '#2A2A3D',
          600: '#3D3D58',
          400: '#7070A0',
          200: '#BBBBD0',
          100: '#E0E0EE',
          50:  '#F4F4FA',
        },
        acid: {
          DEFAULT: '#C8FF57',
          dark:    '#A3D93A',
          light:   '#DEFF8A',
        },
        coral: '#FF6B57',
        sky:   '#57C8FF',
      },
      backgroundImage: {
        'grid-ink': 'linear-gradient(rgba(112,112,160,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(112,112,160,0.07) 1px, transparent 1px)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.5s ease forwards',
        'pulse-acid': 'pulseAcid 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        pulseAcid: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,255,87,0)' },
          '50%':      { boxShadow: '0 0 24px 4px rgba(200,255,87,0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'acid': '0 0 40px -8px rgba(200,255,87,0.4)',
        'glow': '0 0 60px -12px rgba(87,200,255,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
