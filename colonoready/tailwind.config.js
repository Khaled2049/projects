/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lavender: "#d0cfec",
        viridian: "#6A8E7F",
        mossGreen: "#989572",
        ecru: "#C6AE82",
        fairyTale: "#EDC7CF",
      },
    },
  },
  plugins: [],
};
