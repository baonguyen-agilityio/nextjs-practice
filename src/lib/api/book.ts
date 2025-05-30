import { fetchFromStrapi } from "@/lib/api";

export async function getBooks(currentPage: number) {
  const query = new URLSearchParams({
    populate: "image",
    "pagination[page]": currentPage.toString(),
    "pagination[pageSize]": "1",
  });

  console.log(currentPage);
  console.log(query.toString());

  return fetchFromStrapi(`/books?${query.toString()}`, {
    auth: false,
  });
}
