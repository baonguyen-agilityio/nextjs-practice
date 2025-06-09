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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-darkblue font-cardo">
          Articles & Resources
        </h2>
        <span className="block w-10 h-1 my-12 bg-secondary mx-auto"></span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
