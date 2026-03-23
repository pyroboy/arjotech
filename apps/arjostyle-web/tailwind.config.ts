import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Tattoo side — warm ink tones
        ink: {
          50: '#fff8f1',
          100: '#feecdc',
          400: '#f97316',
          500: '#ea580c',
          600: '#c2410c',
          900: '#431407'
        },
        // Software side — cool tech tones
        tech: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          900: '#0c4a6e'
        },
        // Base dark palette
        surface: {
          900: '#09090b',
          800: '#18181b',
          700: '#27272a',
          600: '#3f3f46',
          500: '#52525b'
        }
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Playfair Display', ...fontFamily.serif],
        mono: ['JetBrains Mono', ...fontFamily.mono]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
