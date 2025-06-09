"use client";

import { Button as HeroButton, extendVariants } from "@heroui/react";

export const Button = extendVariants(HeroButton, {
  variants: {
    variant: {
      solid: "text-primary",
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
