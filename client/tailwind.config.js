module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { tan: "#ffe4d4", green: "#b2d2c3" }
    }
  },
  plugins: [require('tailwind-scrollbar-hide'), require('@tailwindcss/forms')],
}

  