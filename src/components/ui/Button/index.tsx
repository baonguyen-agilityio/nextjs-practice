"use client";

import { Button as HeroButton, extendVariants } from "@heroui/react";

export const Button = extendVariants(HeroButton, {
  variants: {
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
