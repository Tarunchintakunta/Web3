/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6", // Purple from your UI
        secondary: "#F3F4F6", // Light gray for backgrounds
      },
    },
  },
  plugins: [],
}