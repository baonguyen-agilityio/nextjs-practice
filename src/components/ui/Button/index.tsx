"use client";

import { Button as HeroButton, extendVariants } from "@heroui/react";

export const Button = extendVariants(HeroButton, {
  variants: {
    variant: {
      solid:
        "data-[color=primary]:text-white data-[color=secondary]:text-primary data-[color=default]:text-primary",
      ghost:
        "data-[color=primary]:text-primary data-[color=secondary]:text-primary data-[color=default]:text-primary",
      bordered:
        "data-[color=primary]:text-primary data-[color=secondary]:text-primary data-[color=default]:text-primary",
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
