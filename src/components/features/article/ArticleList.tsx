"use client";

import { lazy, Suspense, useCallback, useMemo, useTransition } from "react";
import { ArticleCard } from "@/components/features/article/ArticleCard";
import { Banner } from "@/components/ui/Banner";
import SkeletonList from "@/components/ui/SkeletonList";
import { PAGE_DEFAULT } from "@/constants";
import type { Article, MetaResponse } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArticlesEmptyState, SearchEmptyState } from "@/components/ui/EmptyState/variants";

const Pagination = lazy(() => import("@/components/ui/Pagination"));

export default function ArticleList({
  articles,
  pagination,
}: {
  articles: Article[];
  pagination: MetaResponse["pagination"];
}) {
  const { page = PAGE_DEFAULT, pageCount = PAGE_DEFAULT } = pagination ?? {};
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams() ?? "";
  const pathname = usePathname() ?? "";
  const { replace } = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  const hasSearchFilters = useMemo(() => {
    return params.get("search");
  }, [params]);

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
      <Banner
        title="Articles"
        description="There are many variations of passages of Lorem Ipsum available,  have suffered alteration in some form."
      />
      <section className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {isPending ? (
            <SkeletonList length={12} />
          ) : articles.length === 0 ? (
            hasSearchFilters ? (
              <SearchEmptyState searchTerm={params.get("search") || undefined} />
            ) : (
              <ArticlesEmptyState />
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
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
        </div>
      </section>
    </>
  );
}
