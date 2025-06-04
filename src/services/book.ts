import { EXCEPTION_ERROR_MESSAGE } from "@/constants/message";
import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN } from "@/constants";
import { apiClient } from "./api";
import type { BooksDataResponse, BooksResponse, ErrorResponse, FetchDataProps } from "@/types";

export const getBooks = async ({
  searchParams = new URLSearchParams(),
  options = { next: { tags: [API_ENDPOINTS.BOOKS] } },
}: FetchDataProps): BooksDataResponse => {
  try {
    const params = new URLSearchParams(searchParams);
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.BOOKS}?${params.toString()}`);
    const { data, meta, error } = await apiClient.get<BooksResponse & { error?: string }>(url, {
      ...options,
      next: {
        ...options.next,
        revalidate: 3600,
      },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { books: [], error: errorResponse.error.message };
    }

    return {
      books: data,
      ...meta,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("books");

    return { books: [], error: errorMessage };
  }
};
