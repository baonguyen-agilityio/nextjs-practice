import BookCard from "@/components/ui/BookCard";
import Pagination from "@/components/ui/Pagination";
import { getBooks } from "@/lib/api/book";

interface Book {
  id: string;
  title: string;
  price: number;
  description: string;
  image: {
    url: string;
  };
  slug: string;
}

type PageProps = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BooksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const { data, meta } = await getBooks(currentPage);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((book: Book) => (
            <BookCard
              key={book.id}
              title={book.title}
              price={book.price}
              description={book.description}
              image={`${process.env.NEXT_PUBLIC_STRAPI_URL}${book.image.url}`}
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
