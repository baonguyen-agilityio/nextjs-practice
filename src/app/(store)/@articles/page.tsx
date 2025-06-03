import ArticleCard from "@/components/ui/ArticleCard";

const articles = [
  {
    id: 1,
    title: "The newest effective offers the best writers",
    excerpt:
      "Discover the latest offerings from our most talented authors and find your next great read.",
    date: "Jan 01, 2024",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Achieve dreams faster using our exclusive guide",
    excerpt:
      "Unlock your potential with our comprehensive guide to personal development and success.",
    date: "Dec 28, 2023",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "The newest effective offers the best writers",
    excerpt:
      "Stay ahead with cutting-edge insights from industry-leading authors and thought leaders.",
    date: "Dec 25, 2023",
    readTime: "6 min read",
  },
];

export default function ArticlesPage() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-darkblue font-cardo">
          Articles & Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
