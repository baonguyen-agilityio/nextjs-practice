import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#FFCA42",
        mutedBackground: "#F5F8FC",
        title: "#1B3764",
        description: "#969AA0",
      },
      fontFamily: {
        cardo: ["Cardo", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        base: "16px",
        xs: "18px",
        sm: "20px",
        lg: "22px",
        xl: "24px",
        "2xl": "26px",
        "3xl": "28px",
        "4xl": "30px",
        "5xl": "32px",
        "6xl": "34px",
        "7xl": "36px",
        "8xl": "38px",
        "9xl": "40px",
        "10xl": "42px",
      },
    },
  },
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        myTheme: {
          extend: "light",
          colors: {
            background: "#1B3764",
            foreground: "#ffffff",
            default: "#FFCA42",
            primary: {
              DEFAULT: "#ffffff",
              foreground: "#1B3764",
            },
            secondary: {
              DEFAULT: "#B4C7E7",
            },
            focus: "#F182F6",
          },
        },
      },
    }),
  ],
} satisfies Config;
