import BookCard from "@/components/ui/BookCard";
import Pagination from "@/components/ui/Pagination";
import { getBooks } from "@/lib/api/book";

interface SearchParamsProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default async function BooksPage({ searchParams }: SearchParamsProps) {
  const search = await searchParams;
  const currentPage = Number(search?.page) || 1;
  const { data, meta } = await getBooks(currentPage);

  return (
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
              href={`/${book.slug}`}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Pagination total={meta.pagination.pageCount} page={currentPage} />
        </div>
      </div>
    </section>
  );
}
