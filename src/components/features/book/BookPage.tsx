import BookList from "@/components/features/book/BookList";
import { getBooks } from "@/services";

export default async function Books({ searchParamsAPI }: { searchParamsAPI: URLSearchParams }) {
  const { books, ...meta } = await getBooks({
    searchParams: searchParamsAPI,
  });

  return <BookList books={books} pagination={meta.pagination} />;
}
