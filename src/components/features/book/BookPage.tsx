import BookList from "@/components/features/book/BookList";
import { auth } from "@/lib/auth/auth";
import { getBooks } from "@/services";

export default async function Books({ searchParamsAPI }: { searchParamsAPI: URLSearchParams }) {
  const session = await auth();
  const { books, ...meta } = await getBooks({
    searchParams: searchParamsAPI,
  });

  return (
    <BookList books={books} pagination={meta.pagination} isAdmin={session?.user.role === "admin"} />
  );
}
