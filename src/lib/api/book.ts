import { fetchFromStrapi } from "@/lib/api";

export async function getBooks(currentPage: number) {
  const query = new URLSearchParams({
    populate: "image",
    "pagination[page]": currentPage.toString(),
    "pagination[pageSize]": "12",
  });

  return fetchFromStrapi(`/books?${query.toString()}`, {
    auth: false,
  });
}

export async function getBook(slug: string) {
  const query = new URLSearchParams({
    populate: "image",
    "filters[slug][$eq]": slug,
  });

  return fetchFromStrapi(`/books/?${query.toString()}`, {
    auth: false,
  });
}
