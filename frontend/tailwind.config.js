/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary-green': '#1E6E50',
        'primary-blue': '#0F4C81',
        
        // Secondary Colors
        'accent-yellow': '#FFBF00',
        'accent-red': '#D62839',
        
        // Neutrals
        'dark-gray': '#333333',
        'medium-gray': '#666666',
        'light-gray': '#EEEEEE',
        
        // Semantic Colors
        'success': '#28A745',
        'error': '#DC3545',
        'warning': '#FFC107',
        'info': '#17A2B8',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 