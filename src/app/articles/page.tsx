import ArticleList from "@/components/features/article/ArticleList";
import { Banner } from "@/components/ui/Banner";
import SkeletonList from "@/components/ui/SkeletonList";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "@/constants";
import { getArticles } from "@/services/article";
import type { SearchParams } from "@/types";
import { Suspense } from "react";

export default function ArticlesPageWrapper({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <>
          <Banner
            title="Articles"
            description="There are many variations of passages of Lorem Ipsum available,  have suffered alteration in some form."
          />
          <SkeletonList length={6} />
        </>
      }
    >
      <ArticlesPage searchParams={searchParams} />
    </Suspense>
  );
}

async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const { page = PAGE_DEFAULT } = (await searchParams) || {};
  const searchParamsAPI = new URLSearchParams();
  searchParamsAPI.set("pagination[page]", page.toString());
  searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
  searchParamsAPI.set("populate", "*");

  const { articles, ...meta } = await getArticles({
    searchParams: searchParamsAPI,
  });
  return <ArticleList articles={articles} pagination={meta.pagination} />;
}
