"use client";

import { Button as HeroButton, extendVariants } from "@heroui/react";

export const Button = extendVariants(HeroButton, {
  variants: {
    variant: {
      primary: `
        font-bold
        bg-primary text-white border-2 border-primary
        data-[hover]:bg-transparent data-[hover]:text-primary
      `,
      primaryGhost: `
        font-bold
        bg-transparent text-primary border-2 border-primary
        data-[hover]:bg-primary data-[hover]:text-white
      `,
      secondary: `
        font-bold
        bg-secondary text-primary border-2 border-secondary
        data-[hover]:bg-transparent data-[hover]:text-primary
      `,
      secondaryGhost: `
        font-bold
        bg-transparent text-primary border-2 border-secondary
        data-[hover]:bg-secondary data-[hover]:text-primary
      `,
      light: `
        text-primary
        data-[hover]:bg-secondary/50
      `,
    },
  },
  defaultVariants: {
    radius: "none",
    variant: "primary",
    size: "lg",
  },
});
