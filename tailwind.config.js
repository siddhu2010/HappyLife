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
        instagram: {
          blue: '#0095F6',
          red: '#ED4956',
          purple: '#833AB4',
          dark: '#000000',
          gray: '#8E8E8E',
          lightgray: '#DBDBDB',
          border: '#262626',
          input: '#262626',
          elevated: '#121212',
        }
      },
      spacing: {
        'screen-safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
