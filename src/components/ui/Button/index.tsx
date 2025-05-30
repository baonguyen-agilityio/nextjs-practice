"use client";

import { cn } from "@/lib/utils";
import { Button as HeroButton } from "@heroui/button";
import type { ButtonProps as HeroButtonProps } from "@heroui/button";

export function Button(props: HeroButtonProps) {
  const { variant, className, ...rest } = props;

  const hoverClasses = {
    bordered: "hover:bg-accent transition-colors",
    solid: "hover:bg-transparent hover:border hover:border-default transition-colors",
  };

  return (
    <HeroButton
      {...rest}
      radius="none"
      color="default"
      variant={variant}
      className={cn(
        "text-title text-sm border-[1px] border-default transition-colors",
        hoverClasses[variant as keyof typeof hoverClasses],
        className
      )}
    />
  );
}
