/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          main: '#dc004e',
          light: '#f50057',
          dark: '#c51162',
        },
        success: {
          main: '#2e7d32',
          light: '#4caf50',
          dark: '#1b5e20',
        },
        warning: {
          main: '#ed6c02',
          light: '#ff9800',
          dark: '#e65100',
        },
        info: {
          main: '#0288d1',
          light: '#03a9f4',
          dark: '#01579b',
        },
      },
    },
  },
  plugins: [],
  // Importante: no conflictuar con MUI
  corePlugins: {
    preflight: false,
  },
}




