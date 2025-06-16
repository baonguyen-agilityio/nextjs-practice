"use client";

import { Inter } from "next/font/google";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

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

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col h-screen gap-6 items-center justify-center px-4">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <div className="text-center max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We&apos;re sorry, but something unexpected happened. Our team has been notified and
                is working to fix the issue.
              </p>

              {process.env.NODE_ENV === "development" && (
                <details className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-left">
                  <summary className="cursor-pointer text-red-800 dark:text-red-300 font-medium mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-red-700 dark:text-red-400 overflow-auto whitespace-pre-wrap">
                    {error.message}
                    {error.stack}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Button
                variant="solid"
                size="lg"
                onClick={reset}
                className="flex-1"
                aria-label="Try again"
              >
                Try Again
              </Button>
              <Button
                variant="bordered"
                size="lg"
                onClick={handleReload}
                className="flex-1"
                aria-label="Reload page"
              >
                Reload Page
              </Button>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help?{" "}
                <a
                  href="/contact"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/contact";
                  }}
                >
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
