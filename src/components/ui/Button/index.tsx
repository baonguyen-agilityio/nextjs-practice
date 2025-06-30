"use client";

import { Button as HeroButton } from "@heroui/react";
import { forwardRef } from "react";
import type { ButtonProps } from "@heroui/react";
import { cn } from "@/utils/cn";

const variantStyles = {
  primary: `
    font-bold font-cardo
    bg-primary text-white border-2 border-primary
    data-[hover]:bg-transparent data-[hover]:text-primary
  `,
  primaryGhost: `
    font-bold font-cardo
    bg-transparent text-primary border-2 border-primary
    data-[hover]:bg-primary data-[hover]:text-white
  `,
  secondary: `
    font-bold font-cardo
    bg-secondary text-primary border-2 border-secondary
    data-[hover]:bg-transparent data-[hover]:text-primary
  `,
  secondaryGhost: `
    font-bold font-cardo
    bg-transparent text-primary border-2 border-secondary
    data-[hover]:bg-secondary data-[hover]:text-primary
  `,
  light: `
    text-primary
    data-[hover]:bg-secondary/50
  `,
  text: `
    font-inter text-sm
    text-primary
    data-[hover]:text-secondary data-[hover]:decoration-secondary
  `,
} as const;

export interface CustomButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: keyof typeof variantStyles | ButtonProps["variant"];
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>((props, ref) => {
  const { variant = "primary", radius = "none", size = "lg", className = "", ...rest } = props;

  const isCustomVariant = variant in variantStyles;
  const customVariantClass = isCustomVariant
    ? variantStyles[variant as keyof typeof variantStyles]
    : "";

  return (
    <HeroButton
      ref={ref}
      variant={isCustomVariant ? "solid" : (variant as ButtonProps["variant"])}
      radius={radius}
      size={size}
      className={cn(customVariantClass, className)}
      {...rest}
    />
  );
});

Button.displayName = "Button";
