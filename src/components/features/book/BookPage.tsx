import BookList from "@/components/features/book/BookList";
import { auth } from "@/lib/auth/auth";
import { getBooks } from "@/services";
import { getCategories } from "@/services/category";

export default async function Books({ searchParamsAPI }: { searchParamsAPI: URLSearchParams }) {
  const session = await auth();
  const { books, ...meta } = await getBooks({
    searchParams: searchParamsAPI,
  });

  const { data: categories } = await getCategories();

  return (
    <BookList
      books={books}
      pagination={meta.pagination}
      isAdmin={session?.user.role === "admin"}
      categories={categories}
    />
  );
}
