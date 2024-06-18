/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
    },
    borderWidth: {
      DEFAULT: '0.5px',
      '0': '0',
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring))',
        background: {
          DEFAULT: 'oklch(var(--background) / <alpha-value>)',
        },
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        active: 'oklch(var(--active))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        gray: {
          50: '#F9F9F9',
          100: '#EFEFEF',
          200: '#E8E8E8',
          300: '#E0E0E0',
          400: '#D8D8D8',
          500: '#CECECE',
          600: '#BBBBBB',
          700: '#8D8D8D',
          800: '#838383',
          900: '#646464',
          950: '#202020',
        },
        grayAlpha: {
          50: 'oklch(var(--foreground) / 2.35%)',
          100: 'oklch(var(--foreground) / 6.27%)',
          200: 'oklch(var(--foreground) / 9.02%)',
          300: 'oklch(var(--foreground) / 12.16%)',
          400: 'oklch(var(--foreground) / 15.29%)',
          500: 'oklch(var(--foreground) / 19.22%)',
          600: 'oklch(var(--foreground) / 26.67%)',
          700: 'oklch(var(--foreground) / 44.71%)',
          800: 'oklch(var(--foreground) / 48.63%)',
          900: 'oklch(var(--foreground) / 60.78%)',
          950: 'oklch(var(--foreground) / 87.45%)',
        },
        red: {
          '50': '#fdf3f3',
          '100': '#fbe9e8',
          '200': '#f7d4d4',
          '300': '#f0b1b1',
          '400': '#e78587',
          '500': '#d75056',
          '600': '#c43a46',
          '700': '#a52b3a',
          '800': '#8a2735',
          '900': '#772433',
          '950': '#420f18',
        },
        orange: {
          '50': '#fdf6ef',
          '100': '#fbead9',
          '200': '#f7d2b1',
          '300': '#f1b480',
          '400': '#ea8c4d',
          '500': '#e67333',
          '600': '#d65520',
          '700': '#b2401c',
          '800': '#8e341e',
          '900': '#732d1b',
          '950': '#3e140c',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        md: 'calc(var(--radius) + 2px)',
        sm: 'calc(var(--radius) - 2px)',
      },
      boxShadow: {
        1: '0px 6px 20px 0px rgba(0, 0, 0, 0.15)',
        2: '0px 0px 2px 0px rgba(0, 0, 0, 0.2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
