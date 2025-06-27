import Books from "@/components/features/book/BookPage";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "@/constants";
import type { SearchParams } from "@/types";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => ({
  title: "Books",
});

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  // TEST ERROR - Remove after testing
  // throw new Error("Testing books error page");

  const { page = PAGE_DEFAULT, categories = "", search = "" } = (await searchParams) || {};
  const searchParamsAPI = new URLSearchParams();
  searchParamsAPI.set("pagination[page]", page.toString());
  searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT.toString());
  searchParamsAPI.set("populate", "*");

  if (categories) {
    searchParamsAPI.set("filters[categories][documentId][$eq]", categories);
  }

  if (search) {
    searchParamsAPI.set("filters[title][$containsi]", search);
  }

  return <Books searchParamsAPI={searchParamsAPI} />;
}
