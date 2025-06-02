"use client";

import { Button as HeroButton, extendVariants } from "@heroui/react";

export const Button = extendVariants(HeroButton, {
  variants: {
    variant: {
      bordered: "hover:bg-secondary transition-colors text-primary",
      solid:
        "text-primary hover:border hover:border-secondary hover:text-secondary hover:bg-transparent transition-colors",
    },

    color: {
      default: "default",
      primary: "primary",
      secondary: "secondary",
    },
  },
  defaultVariants: {
    radius: "none",
    variant: "solid",
    color: "secondary",
    size: "lg",
  },
});
