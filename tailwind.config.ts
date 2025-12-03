import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        win98: {
          bg: "#c0c0c0",
          dark: "#808080",
          light: "#ffffff",
          shadow: "#404040",
          text: "#000000"
        }
      },
      fontFamily: {
        sans: ["'MS Sans Serif'", "Tahoma", "Geneva", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
