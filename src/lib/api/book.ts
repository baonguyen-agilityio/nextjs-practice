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

export async function getCartItems(userId: string) {
  const query = new URLSearchParams({
    "filters[users_permissions_user][id][$eq]": userId.toString(),
    populate: "*",
  });

  return fetchFromStrapi(`/carts?${query.toString()}`);
}

export async function getCartItem(documentId: string) {
  const query = new URLSearchParams({
    "filters[documentId][$eq]": documentId,
    "populate[book][populate]": "image",
  });

  return fetchFromStrapi(`/cart-items?${query.toString()}`);
}
