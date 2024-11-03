import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        cyberpunk:
          "0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(255, 100, 0, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.3)",
      },
      colors: {
        "steampunk-bronze": "rgba(130, 82, 1, 0.7)", // Steampunk-inspired bronze border color
      },
      spacing: {
        lg: "30rem",
      },
    },
  },
  plugins: [],
};
export default config;
