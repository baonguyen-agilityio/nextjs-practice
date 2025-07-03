"use client";

import ErrorPage from "@/components/ui/ErrorPage";
import { fontCardo, fontInter } from "@/config/fonts";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.error("Global error:", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className={`${fontCardo.variable} ${fontInter.variable} font-cardo`}>
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
          <ErrorPage
            title="Something went wrong!"
            message="We encountered an unexpected error. Don't worry, our team has been notified."
            onRetry={reset}
          />
        </main>
      </body>
    </html>
  );
}
