"use client";

import EmptyState from "./index";

const ArticlesIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const BooksIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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
      title="No articles found"
      message="There are no articles to display at the moment. Check back later or try refreshing the page."
      icon={<ArticlesIcon />}
      action={onAddArticle ? { label: "Add Article", onClick: onAddArticle } : undefined}
    />
  );
}

export function BooksEmptyState({ onAddBook }: { onAddBook?: () => void }) {
  return (
    <EmptyState
      title="No books found"
      message="There are no books to display at the moment. Check back later or try refreshing the page."
      icon={<BooksIcon />}
      action={onAddBook ? { label: "Add Book", onClick: onAddBook } : undefined}
    />
  );
}

export function SearchEmptyState({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      title="No results found"
      message={
        searchTerm
          ? `No results found for "${searchTerm}". Try adjusting your search criteria.`
          : "No results found. Try a different search term."
      }
      icon={<SearchIcon />}
    />
  );
}

export function NotFoundEmptyState({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <EmptyState
      title="Page not found"
      message="The page you're looking for doesn't exist. It might have been moved or deleted."
      action={onGoHome ? { label: "Go Home", onClick: onGoHome } : undefined}
    />
  );
}
