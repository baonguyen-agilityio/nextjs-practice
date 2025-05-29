import { Cardo, Inter } from "next/font/google";

export const fontCardo = Cardo({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-cardo",
});

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
