import { ArticleCard } from "@/components/features/article/ArticleCard";
import { getArticles } from "@/services/article";
import { ArticlesEmptyState } from "@/components/ui/EmptyState/variants";

export default async function ArticlesPage() {
  const searchParamsAPI = new URLSearchParams();
  searchParamsAPI.set("pagination[page]", "1");
  searchParamsAPI.set("pagination[pageSize]", "3");
  searchParamsAPI.set("populate", "*");

  const { articles } = await getArticles({
    searchParams: searchParamsAPI,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.length === 0 ? (
        <div className="col-span-full">
          <ArticlesEmptyState />
        </div>
      ) : (
        articles.map((article) => <ArticleCard key={article.id} article={article} />)
      )}
    </div>
  );
}
