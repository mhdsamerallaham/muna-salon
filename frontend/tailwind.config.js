/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#F8BBD9',
          cream: '#F5F5DC',
          gold: '#D4AF37',
        },
        secondary: {
          black: '#1C1C1C',
          white: '#FFFFFF',
          gray: '#F8F9FA',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}