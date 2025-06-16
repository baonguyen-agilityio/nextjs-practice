"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider
        toastProps={{
          variant: "bordered",
          classNames: {
            base: "font-inter",
            title: "text-[14px]",
            description: "text-[12px]",
          },
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
