"use client";

import ErrorPage from "@/components/ui/ErrorPage";

interface BooksErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BooksError({ reset }: BooksErrorProps) {
  return (
    <ErrorPage
      title="Failed to Load Books"
      message="We're having trouble loading our book collection right now. Please try again."
      onRetry={reset}
    />
  );
}
