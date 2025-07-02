/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { SelectProps } from "@heroui/react";
import { Select as HeroSelect, extendVariants } from "@heroui/react";
import { cn } from "@/utils/cn";

const StyledSelect = extendVariants(HeroSelect, {
  defaultVariants: {
    size: "md",
    radius: "none",
    color: "default",
  },
  variants: {
    isInvalid: {
      true: {
        trigger: [
          "!bg-default-100",
          "data-[hover=true]:!bg-default-100",
          "data-[focus=true]:!bg-default-100",
          "data-[open=true]:!bg-default-100",
          "data-[invalid=true]:!bg-default-100",
        ],
        label: ["!text-default-500", "data-[invalid=true]:!text-default-500"],
      },
    },
  },
});

export const Select: React.FC<SelectProps> = ({ className, classNames, ...props }) => {
  const { ref, ...restProps } = props;
  return (
    <StyledSelect
      className={cn("font-inter", className)}
      classNames={{
        base: "font-inter",
        trigger: "font-inter text-[14px]",
        label: "font-inter text-[14px]",
        value: "font-inter text-[14px]",
        listboxWrapper: "font-inter",
        listbox: "font-inter",
        popoverContent: "font-inter",
        ...classNames,
      }}
      {...restProps}
    />
  );
};

export { SelectItem } from "@heroui/react";
