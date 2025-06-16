"use client";

import { lazy, Suspense, useCallback, useMemo, useTransition } from "react";
import BookCard from "@/components/features/book/BookCard";
import SkeletonList from "@/components/ui/SkeletonList";
import { PAGE_DEFAULT } from "@/constants";
import type { Book, Category, MetaResponse } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BookFilter from "./BookFilter";
import CreateBookModal from "./CreateBookModal";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const Pagination = lazy(() => import("@/components/ui/Pagination"));

export default function BookList({
  books,
  pagination,
  isAdmin,
  categories,
}: {
  books: Book[];
  pagination: MetaResponse["pagination"];
  isAdmin: boolean;
  categories: Category[];
}) {
  const { page = PAGE_DEFAULT, pageCount = PAGE_DEFAULT } = pagination ?? {};
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams() ?? "";
  const pathname = usePathname() ?? "";
  const { replace } = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  const handleReplaceURL = useCallback(
    (params: URLSearchParams) => {
      startTransition?.(() => {
        replace(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },
    [pathname, replace, startTransition]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", `${page}`);
      }

      handleReplaceURL(params);
    },
    [handleReplaceURL, params]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      if (value) {
        params.set("categories", value);
      } else {
        params.delete("categories");
      }
      params.delete("page");
      handleReplaceURL(params);
    },
    [handleReplaceURL, params]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      handleReplaceURL(params);
    },
    [handleReplaceURL, params]
  );

  const debouncedSearchChange = useDebouncedCallback(
    (value: string) => handleSearchChange(value),
    500
  );

  return (
    <>
      <div className="flex justify-between items-center mb-8 gap-4 w-full">
        <BookFilter
          categories={categories}
          onSearchChange={debouncedSearchChange}
          onCategoryChange={handleCategoryChange}
        />
        {isAdmin && <CreateBookModal categories={categories} />}
      </div>
      {isPending ? (
        <SkeletonList length={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
          {books.map((book: Book) =>
            isAdmin ? (
              <BookCard book={book} key={book.id} isAdmin={isAdmin} categories={categories} />
            ) : (
              <Link href={`/books/${book.documentId}`} key={book.id} className="block h-full">
                <BookCard book={book} isAdmin={isAdmin} categories={categories} />
              </Link>
            )
          )}
        </div>
      )}
      {!!pagination && pagination.pageCount > 1 && (
        <div className="flex justify-end">
          <Suspense fallback={null}>
            <Pagination total={pageCount} initialPage={page} onChange={handlePageChange} />
          </Suspense>
        </div>
      )}
    </>
  );
}
