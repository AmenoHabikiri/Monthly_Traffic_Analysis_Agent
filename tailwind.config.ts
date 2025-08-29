import type { Config } from "tailwindcss"

export default {
  darkMode: "class", // Change from ["class"] to "class"
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'rakuten-pink': '#FF3399',
        'rakuten-red': '#C00000',
        'rakuten-blue': '#0070C0',
        'rakuten-yellow': '#FFC000',
        'rakuten-green': '#00B050',
        'rakuten-amber': '#CC9900',
        'rakuten-gray': '#A6A6A6',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config