import { extendVariants, Input as HeroInput } from "@heroui/react";

export const Input = extendVariants(HeroInput, {
  defaultVariants: {
    size: "md",
    radius: "none",
  },
});
