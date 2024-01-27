/** Copyright (c) 2024, Tegon, all rights reserved. **/

import type { Config } from 'tailwindcss';

import { fontFamily } from 'tailwindcss/defaultTheme';

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
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
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
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        gray: {
          50: '#f5f7fa',
          100: '#e4e7eb',
          200: '#cbd2d9',
          300: '#9aa581',
          400: '#7b8794',
          500: '#616e74',
          600: '#52606d',
          700: '#3e4c59',
          800: '#323f4b',
          900: '#1f2933',
        },
        neutral: {
          50: '#f5f7fa',
          100: '#e4e7eb',
          200: '#cbd2d9',
          300: '#9aa581',
          400: '#7b8794',
          500: '#616e74',
          600: '#52606d',
          700: '#3e4c59',
          800: '#323f4b',
          900: '#1f2933',
        },
        blue: {
          900: '#002159',
          800: '#01337D',
          700: '#03449E',
          600: '#0552B5',
          500: '#0967D2',
          400: '#2186EB',
          300: '#47A3F3',
          200: '#7CC4FA',
          100: '#BAE3FF',
          50: '#E6F6FF',
        },
        red: {
          900: '#610316',
          800: '#8A041A',
          700: '#AB091E',
          600: '#CF1124',
          500: '#E12D39',
          400: '#EF4E4E',
          300: '#F86A6A',
          200: '#FF9B9B',
          100: '#FFBDBD',
          50: '#FFE3E3',
        },
        yellow: {
          900: '#8D2B0B',
          800: '#B44D12',
          700: '#CB6E17',
          600: '#DE911D',
          500: '#F0B429',
          400: '#F7C948',
          300: '#FADB5F',
          200: '#FCE588',
          100: '#FFF3C4',
          50: '#FFFBEA',
        },
        cyan: {
          900: '#05606E',
          800: '#07818F',
          700: '#099AA4',
          600: '#0FB5BA',
          500: '#1CD4D4',
          400: '#3AE7E1',
          300: '#62F4EB',
          200: '#92FDF2',
          100: '#C1FEF6',
          50: '#E1FCF8',
        },
        orange: {
          900: '#841003',
          800: '#AD1D07',
          700: '#C52707',
          600: '#DE3A11',
          500: '#F35627',
          400: '#F9703E',
          300: '#FF9466',
          200: '#FFB088',
          100: '#FFD0B5',
          50: '#FFE8D9',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
