import { extendVariants, Input as HeroInput } from "@heroui/react";

export const Input = extendVariants(HeroInput, {
  defaultVariants: {
    color: "primary",
    size: "md",
    radius: "none",
  },
});
