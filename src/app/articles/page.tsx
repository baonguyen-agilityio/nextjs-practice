import { ArticleCard } from "@/components/ui/ArticleCard";
import { Banner } from "@/components/ui/Banner";
import Pagination from "@/components/ui/Pagination";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "@/constants";
import { getArticles } from "@/services/article";
import type { SearchParams } from "@/types";

export default async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const { page = PAGE_DEFAULT } = (await searchParams) || {};
  const searchParamsAPI = new URLSearchParams();
  searchParamsAPI.set("pagination[page]", page.toString());
  searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
  searchParamsAPI.set("populate", "*");

  const { articles, ...meta } = await getArticles({
    searchParams: searchParamsAPI,
  });
  return (
    <>
      <Banner
        title="Articles"
        description="There are many variations of passages of Lorem Ipsum available,  have suffered alteration in some form."
      />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="flex justify-end mt-10">
            <Pagination
              total={meta.pagination?.pageCount ?? PAGE_DEFAULT}
              initialPage={meta.pagination?.page ?? PAGE_DEFAULT}
            />
          </div>
        </div>
      </section>
    </>
  );
}
