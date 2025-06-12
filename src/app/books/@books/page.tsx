import Books from "@/components/features/book/BookPage";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "@/constants";
import type { SearchParams } from "@/types";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { page = PAGE_DEFAULT } = (await searchParams) || {};
  const searchParamsAPI = new URLSearchParams();
  searchParamsAPI.set("pagination[page]", page.toString());
  searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
  searchParamsAPI.set("populate", "image");

  return <Books searchParamsAPI={searchParamsAPI} />;
}
