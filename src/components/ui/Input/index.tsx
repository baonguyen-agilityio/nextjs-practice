/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { InputProps } from "@heroui/react";
import { Input as HeroInput, extendVariants } from "@heroui/react";
import { cn } from "@/utils/cn";

const StyledInput = extendVariants(HeroInput, {
  defaultVariants: {
    size: "md",
    radius: "none",
    color: "default",
  },
  variants: {
    isInvalid: {
      true: {
        inputWrapper: [
          "!bg-default-100",
          "data-[hover=true]:!bg-default-100",
          "group-data-[focus=true]:!bg-default-100",
          "data-[invalid=true]:!bg-default-100",
        ],
        label: ["!text-default-500", "data-[invalid=true]:!text-default-500"],
      },
    },
  },
});
export const Input: React.FC<InputProps> = ({ className, classNames, ...props }) => {
  const { ref, ...restProps } = props;
  return (
    <StyledInput
      className={cn("font-inter", className)}
      classNames={{
        base: "font-inter",
        input: "text-[14px]",
        label: "text-[14px]",
        ...classNames,
      }}
      {...restProps}
    />
  );
};
