"use client";

import ErrorPage from "@/components/ui/ErrorPage";

interface ArticleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ArticleError({ error, reset }: ArticleErrorProps) {
  const isNotFound = error.message.includes("404") || error.message.includes("not found");

  return (
    <ErrorPage
      title={isNotFound ? "Article Not Found" : "Failed to Load Article"}
      message={
        isNotFound
          ? "The article you're looking for doesn't exist or may have been moved."
          : "We're having trouble loading this article right now. Please try again."
      }
      onRetry={!isNotFound ? reset : undefined}
      showRetryButton={!isNotFound}
    />
  );
}
