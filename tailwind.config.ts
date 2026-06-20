import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        panel: "#101010",
        panel2: "#171717",
        line: "#2a2a2a",
        blood: "#e11d2f",
        ember: "#ff3448"
      },
      boxShadow: {
        glow: "0 0 40px rgba(225, 29, 47, 0.18)"
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
