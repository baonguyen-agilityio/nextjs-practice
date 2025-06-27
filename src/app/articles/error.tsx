"use client";

import ErrorPage from "@/components/ui/ErrorPage";

interface ArticlesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ArticlesError({ reset }: ArticlesErrorProps) {
  return (
    <ErrorPage
      title="Failed to Load Articles"
      message="We're having trouble loading the articles right now. Please try again."
      onRetry={reset}
    />
  );
}
