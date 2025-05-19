// tailwind.config.js
import scrollbarHide from "tailwind-scrollbar-hide";
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tan: "#ffe4d4",
        ash: "#b2d2c3",
        slate: "#305252",
        onyx: "#373e40",
        amaranth: "#b6244f",
      },
      fontFamily: {
        yorkmade: ["Yorkmade", "sans-serif"],
      },
    },
  },
  plugins: [scrollbarHide, forms],
};
