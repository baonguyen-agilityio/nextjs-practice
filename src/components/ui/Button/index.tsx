"use client";

import { Button as HeroButton } from "@heroui/button";
import type { ButtonProps as HeroButtonProps } from "@heroui/button";

export function Button(props: HeroButtonProps) {
  return <HeroButton color="primary" className="border border-accent" {...props} />;
}
