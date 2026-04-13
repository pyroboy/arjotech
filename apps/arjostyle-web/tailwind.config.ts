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
        // RED CTA accent
        red: {
          400: '#ff6b6b',
          500: '#FF4D4D',
          600: '#dc2626',
        },
        // Base dark palette — brutalist deep dark
        surface: {
          900: '#0A0A0F',
          800: '#111116',
          700: '#18181D',
          600: '#27272A',
          500: '#3f3f46'
        },
        // Aliases for bg-dark
        dark: '#0A0A0F',
        elevated: '#18181D',
        border: '#27272A',
        'border-light': '#3f3f46',
      },
      fontFamily: {
        sans: ['DM Sans', ...fontFamily.sans],
        display: ['Bebas Neue', ...fontFamily.serif],
        mono: ['JetBrains Mono', ...fontFamily.mono]
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '2px',
        'md': '2px',
        'lg': '2px',
        'xl': '2px',
      },
      boxShadow: {
        'brutal': '4px 4px 0 var(--border)',
        'brutal-sm': '2px 2px 0 var(--border)',
        'brutal-ink': '4px 4px 0 var(--ink)',
        'brutal-tech': '4px 4px 0 var(--tech)',
        'brutal-red': '4px 4px 0 var(--red)',
      }
    }
  },
  plugins: []
};

export default config;
