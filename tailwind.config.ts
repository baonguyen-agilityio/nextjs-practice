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
  mode: "jit",
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
        lg: "22px",
        xl: "24px",
        "5xl": "32px",
      },
    },
  },
  plugins: [
    heroui({
      addCommonColors: false,
      layout: {
        radius: {
          large: "0px",
        },
        borderWidth: {
          medium: "1px",
        },
      },
      themes: {
        myTheme: {
          colors: {
            default: "#ffffff",
            primary: "#1B3764",
            secondary: "#FFCA42",
            background: "#F6F8FC",
          },
        },
      },
    }),
  ],
} satisfies Config;
