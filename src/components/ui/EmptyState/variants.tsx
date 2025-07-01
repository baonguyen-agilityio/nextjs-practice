"use client";

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

const HomeIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
      message="The page you're looking for doesn't exist or has been moved."
      icon={<HomeIcon />}
      action={onGoHome ? { label: "Go Home", onClick: onGoHome } : undefined}
    />
  );
}
