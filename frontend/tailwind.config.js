/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        coloralpha:"var(--color-alpha)",
        color0:"var(--color-0)",
        color1:"var(--color-1)",
        color2:"var(--color-2)",
        color3:"var(--color-3)",
        color4:"var(--color-4)",
        color5:"var(--color-5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}