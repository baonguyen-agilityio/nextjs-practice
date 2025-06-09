"use client";

import { lazy, Suspense, useCallback, useMemo, useTransition } from "react";
import BookCard from "@/components/ui/BookCard";
import SkeletonList from "@/components/ui/SkeletonList";
import { PAGE_DEFAULT } from "@/constants";
import type { Book, MetaResponse } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = lazy(() => import("@/components/ui/Pagination"));

export default function BookList({
  books,
  pagination,
}: {
  books: Book[];
  pagination: MetaResponse["pagination"];
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

  return (
    <>
      {isPending ? (
        <SkeletonList length={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {books.map((book: Book) => (
            <BookCard book={book} key={book.id} />
          ))}
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
