import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FFFFFF",
        accent: "#FFCA42",
        darkblue: "#1B3764",
        lightblue: "#B4C7E7",
      },
      fontFamily: {
        cardo: ["Cardo", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: "10px",
        base: "16px",
        sm: "17px",
        lg: "18px",
        xl: "19px",
        "2xl": "24px",
        "3xl": "28px",
        "4xl": "36px",
        "5xl": "48px",
        "6xl": "60px",
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
