import BookList from "@/components/features/book/BookList";
import { getBooks } from "@/services";

export default async function Books({ searchParamsAPI }: { searchParamsAPI: URLSearchParams }) {
  const { books, ...meta } = await getBooks({
    searchParams: searchParamsAPI,
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <BookList books={books} pagination={meta.pagination} />
      </div>
    </section>
  );
}
