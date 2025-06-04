import BookCard from "@/components/ui/BookCard";
import Pagination from "@/components/ui/Pagination";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "@/constants";
import { getBooks } from "@/services";
import type { BookResponse, SearchParams } from "@/types";

export default async function BooksPage({ searchParams }: { searchParams: SearchParams }) {
  const { page = PAGE_DEFAULT } = (await searchParams) || {};
  const searchParamsAPI = new URLSearchParams();
  searchParamsAPI.set("pagination[page]", page.toString());
  searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
  searchParamsAPI.set("populate", "image");

  const { books, ...meta } = await getBooks({
    searchParams: searchParamsAPI,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {books.map((book: BookResponse) => (
            <BookCard
              key={book.id}
              title={book.attributes.title}
              price={book.attributes.price}
              description={book.attributes.description}
              image={`${process.env.NEXT_PUBLIC_STRAPI_URL}${book.attributes.image.data.attributes.url}`}
              href={`/${book.attributes.slug}`}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Pagination
            total={meta.pagination?.pageCount ?? PAGE_DEFAULT}
            initialPage={meta.pagination?.page ?? PAGE_DEFAULT}
          />
        </div>
      </div>
    </section>
  );
}
