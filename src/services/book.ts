import { EXCEPTION_ERROR_MESSAGE } from "@/constants/message";
import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN } from "@/constants";
import { apiClient } from "./api";
import type {
  BookDataResponse,
  BooksDataResponse,
  BooksStrapiResponse,
  BookStrapiResponse,
  ErrorResponse,
  FetchDataProps,
  BookPayload,
} from "@/types";

export const getBooks = async ({
  searchParams = new URLSearchParams(),
  options = { next: { tags: [API_ENDPOINTS.BOOKS] } },
}: FetchDataProps): BooksDataResponse => {
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
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { books: [], error: errorResponse.error.message };
    }

    const books = data.map(({ image, ...rest }) => {
      return {
        ...rest,
        imageUrl: image.url,
      };
    });

    return {
      books: books,
      ...meta,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("books");

    return { books: [], error: errorMessage };
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
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { book: null, error: errorResponse.error.message };
    }

    const { image, ...rest } = data;
    return { book: { ...rest, imageUrl: image.url || "" }, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("book");

    return { book: null, error: errorMessage };
  }
};

export const createBookService = async (
  payload: BookPayload
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await apiClient.post<BookStrapiResponse>(`${API_ROUTE_ENDPOINT.BOOKS}`, {
      body: { data: payload },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { success: false, error: errorResponse.error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : EXCEPTION_ERROR_MESSAGE.ADD("book"),
    };
  }
};

export const deleteBook = async ({ id }: { id: string }): Promise<BookDataResponse> => {
  try {
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.BOOKS}/${id}`);
    const { error } = await apiClient.delete<BookStrapiResponse>(url, {
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { book: null, error: errorResponse.error.message };
    }

    return { book: null, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.DELETE("book");

    return { book: null, error: errorMessage };
  }
};

export const updateBookService = async (
  id: string,
  payload: BookPayload
): Promise<{ success: boolean; error?: string }> => {
  console.log(id, payload);
  try {
    const { error } = await apiClient.put<BookStrapiResponse>(`${API_ROUTE_ENDPOINT.BOOKS}/${id}`, {
      body: { data: payload },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { success: false, error: errorResponse.error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : EXCEPTION_ERROR_MESSAGE.UPDATE("book"),
    };
  }
};
