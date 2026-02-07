/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'estetia-primary': '#D4AFB9',      // Dusty Rose
        'estetia-secondary': '#EAE2E6',    // Light Greyish-Rose
        'estetia-accent': '#B08A93',        // Deeper Rose
        'estetia-text': '#4A4A4A',         // Soft Dark Grey
        'estetia-bg': '#FCFBFB',           // Soft Cream White
        'estetia-whatsapp': '#25D366',
      },
    },
  },
  plugins: [],
}