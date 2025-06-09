"use client";

import { Card as HeroCard, extendVariants } from "@heroui/react";

export const Card = extendVariants(HeroCard, {
  variants: {},
  defaultVariants: {
    radius: "none",
    variant: "solid",
    color: "secondary",
    size: "lg",
  },
});
