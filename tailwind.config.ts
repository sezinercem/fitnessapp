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
        ink: "#f3f4f6",
        panel: "#ffffff",
        panel2: "#eef2f3",
        line: "#d7dde0",
        blood: "#34d399",
        ember: "#00f58a"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
