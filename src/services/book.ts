import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN } from "@/constants";
import { apiClient } from "./api";
import type {
  BookDataResponse,
  BooksDataResponse,
  BooksStrapiResponse,
  BookStrapiResponse,
  FetchDataProps,
  BookPayload,
} from "@/types";
import { handleApiError } from "@/lib/errors/handleApiError";
import { revalidateTag } from "next/cache";

export const getBooks = async ({
  searchParams = new URLSearchParams(),
  options = { next: { tags: [API_ENDPOINTS.BOOKS] } },
}: FetchDataProps): Promise<BooksDataResponse> => {
  try {
    const params = new URLSearchParams(searchParams);
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.BOOKS}?${params.toString()}`);

    const { data, meta, error } = await apiClient.get<BooksStrapiResponse & { error?: string }>(
      url,
      {
        ...options,
        next: {
          ...options.next,
          revalidate: 3600,
        },
        baseUrl: DOMAIN,
      }
    );

    if (error) {
      const { error: parsedError } = handleApiError(error);
      const message = typeof parsedError === "string" ? parsedError : "Something went wrong";
      return { books: [], error: message };
    }

    const books = data.map(({ image, ...rest }) => ({
      ...rest,
      imageUrl: image?.url ?? "",
    }));

    return {
      books,
      ...meta,
      error: null,
    };
  } catch (err) {
    const { error: parsedError } = handleApiError(err);
    const message = typeof parsedError === "string" ? parsedError : "Something went wrong";
    return { books: [], error: message };
  }
};

export const getBook = async ({ id }: { id: string }): BookDataResponse => {
  try {
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.BOOKS}/${id}`);
    const { data, error } = await apiClient.get<BookStrapiResponse>(url, {
      next: {
        revalidate: 3600,
        tags: [API_ENDPOINTS.BOOKS, id],
      },
      baseUrl: DOMAIN,
    });

    if (error) {
      const { error: parsedError } = handleApiError(error);
      const message = typeof parsedError === "string" ? parsedError : "Something went wrong";
      return { book: null, error: message };
    }

    const { image, ...rest } = data;
    return { book: { ...rest, imageUrl: image.url || "" }, error: null };
  } catch (error) {
    const { error: parsedError } = handleApiError(error);
    const message = typeof parsedError === "string" ? parsedError : "Something went wrong";
    return { book: null, error: message };
  }
};

export const createBookService = async (
  payload: BookPayload
): Promise<{ success: boolean; error?: string | Record<string, string[]> }> => {
  try {
    const { error } = await apiClient.post<BookStrapiResponse>(`${API_ROUTE_ENDPOINT.BOOKS}`, {
      body: { data: payload },
      baseUrl: DOMAIN,
    });

    if (error) {
      const { error: parsedError } = handleApiError(error);
      return { success: false, error: parsedError };
    }

    return { success: true };
  } catch (err) {
    const { error: parsedError } = handleApiError(err);
    return { success: false, error: parsedError };
  }
};

export const deleteBook = async ({ id }: { id: string }): Promise<BookDataResponse> => {
  try {
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.BOOKS}/${id}`);
    const { error } = await apiClient.delete<BookStrapiResponse>(url, {
      baseUrl: DOMAIN,
    });

    if (error) {
      const { error: parsedError } = handleApiError(error);
      const message = typeof parsedError === "string" ? parsedError : "Something went wrong";
      return { book: null, error: message };
    }

    return { book: null, error: null };
  } catch (error) {
    const { error: parsedError } = handleApiError(error);
    const message = typeof parsedError === "string" ? parsedError : "Something went wrong";
    return { book: null, error: message };
  }
};

export const updateBookService = async (
  id: string,
  payload: BookPayload
): Promise<{ success: boolean; error?: string | Record<string, string[]> }> => {
  try {
    const { error } = await apiClient.put<BookStrapiResponse>(`${API_ROUTE_ENDPOINT.BOOKS}/${id}`, {
      body: { data: payload },
      baseUrl: DOMAIN,
    });

    if (error) {
      const { error: parsedError } = handleApiError(error);
      return { success: false, error: parsedError };
    }
    revalidateTag(API_ENDPOINTS.BOOKS);

    return { success: true };
  } catch (err) {
    const { error: parsedError } = handleApiError(err);
    return { success: false, error: parsedError };
  }
};
