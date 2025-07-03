"use client";

import Image from "next/image";
import EmptyState from "./index";

const BookIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export function ArticlesEmptyState({ onAddArticle }: { onAddArticle?: () => void }) {
  return (
    <EmptyState
      headingLevel={3}
      title="No articles available"
      message="There are no articles to display at this time. Check back later for new content!"
      icon={<BookIcon />}
      action={onAddArticle ? { label: "Add Article", onClick: onAddArticle } : undefined}
    />
  );
}

export function BooksEmptyState({ onAddBook }: { onAddBook?: () => void }) {
  return (
    <EmptyState
      headingLevel={2}
      title="No books available"
      message="Our book collection is currently empty. Check back later for new arrivals!"
      icon={<BookIcon />}
      action={onAddBook ? { label: "Add Book", onClick: onAddBook } : undefined}
    />
  );
}

export function SearchEmptyState({ searchTerm }: { searchTerm?: string }) {
  const title = searchTerm ? `No results for "${searchTerm}"` : "No search results";
  const message = searchTerm
    ? "Try adjusting your search terms or browse all items."
    : "Enter a search term to find books and articles.";

  return <EmptyState headingLevel={2} title={title} message={message} icon={<SearchIcon />} />;
}

export function NotFoundEmptyState({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <EmptyState
      headingLevel={1}
      title="Page Not Found"
      message="The page you are looking for doesn't exist. Please try searching for some other page, or return to the website's homepage to find what you're looking for."
      icon={<Image src="/404.png" alt="Not Found" width={500} height={100} />}
      action={onGoHome ? { label: "Back to Home", onClick: onGoHome } : undefined}
    />
  );
}
