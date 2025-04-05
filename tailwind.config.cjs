/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e", // Green for health theme
        secondary: "#F3F4F6", // Light gray for backgrounds
      },
    },
  },
  plugins: [],
}