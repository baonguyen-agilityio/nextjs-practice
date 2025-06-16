import { extendVariants, Toast as HeroToast } from "@heroui/react";

export const Toast = extendVariants(HeroToast, {
  variants: {},
  defaultVariants: {
    placement: "top-right",
    color: "default",
    isDismissible: true,
    isClosable: true,
  },
});
