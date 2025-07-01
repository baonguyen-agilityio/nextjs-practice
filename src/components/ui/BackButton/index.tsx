"use client";

import { Button } from "@/components/ui/Button";

interface BackButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "secondaryGhost" | "text";
}

export default function BackButton({
  children = "← Back to list",
  className = "",
  variant = "secondaryGhost",
}: BackButtonProps) {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Button variant={variant} onClick={handleGoBack} className={className}>
      {children}
    </Button>
  );
}
