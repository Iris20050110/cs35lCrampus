// postcss.config.js (ESM)
import tailwindcss from "@tailwindcss/postcss"; // Import from the '@tailwindcss/postcss' package
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    tailwindcss(), // Call tailwindcss as a function
    autoprefixer,
  ],
};
