"use client";

import ErrorPage from "@/components/ui/ErrorPage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ErrorPage
        title="Something went wrong!"
        message="We encountered an unexpected error. Don't worry, our team has been notified."
        onRetry={reset}
      />
    </div>
  );
}
