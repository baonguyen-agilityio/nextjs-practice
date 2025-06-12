import { ArticleCard } from "@/components/ui/ArticleCard";
import { getArticles } from "@/services/article";

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
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
