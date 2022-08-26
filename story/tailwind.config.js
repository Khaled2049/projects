// @type {import('tailwindcss').Config}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        home: '75% minmax(150px, 2fr)',
      },
    },
  },
  plugins: [],
};
