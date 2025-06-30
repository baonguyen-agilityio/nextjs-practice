"use client";

import { Card as HeroCard, CardBody, CardFooter } from "@heroui/react";
import { forwardRef } from "react";
import type { CardProps } from "@heroui/react";

export const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { radius = "none", shadow = "none", className = "", ...rest } = props;

  return <HeroCard ref={ref} radius={radius} shadow={shadow} className={className} {...rest} />;
});

Card.displayName = "Card";

export { CardBody, CardFooter };
