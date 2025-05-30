import BookCard from "@/components/ui/BookCard";
import Pagination from "@/components/ui/Pagination";
import { getBooks } from "@/lib/api/book";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Store - Pages Bookstore",
  description: "Discover amazing books and articles at Pages, your premier online bookstore.",
};

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

interface SearchParamsProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default async function Home({ searchParams }: SearchParamsProps) {
  const search = await searchParams;
  const currentPage = Number(search?.page) || 1;
  const { data, meta } = await getBooks(currentPage);

  return (
    <main className="min-h-screen">
      <section className="bg-background text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-5xl md:text-5xl mb-4">My Store</h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto font-inter">
            Looking for your next great read? Look no further than our expert recommendations and
            curated collections.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data.map((book: any) => (
              <BookCard
                key={book.id}
                title={book.title}
                price={book.price}
                description={book.description}
                image={`${process.env.STRAPI_URL}${book.image.url}`}
              />
            ))}
          </div>
          <Pagination total={meta.pagination.pageCount} page={currentPage} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-darkblue font-cardo">
            Articles & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/significant.png"
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-accent font-semibold text-sm hover:underline inline-block"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
