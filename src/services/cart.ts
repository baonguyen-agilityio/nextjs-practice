import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN, EXCEPTION_ERROR_MESSAGE } from "@/constants";
import { apiClient } from "./api";
import type { CartDataResponse, CartResponse, ErrorResponse, FetchDataProps } from "@/types";

export const getCartByUserId = async ({
  searchParams = new URLSearchParams(),
  options = { next: { tags: [API_ENDPOINTS.CART] } },
}: FetchDataProps): CartDataResponse => {
  try {
    const params = new URLSearchParams(searchParams);
    const api = await apiClient.apiClientSession();
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.CART}?${params.toString()}`);

    const { data, error } = await api.get<CartResponse & { error?: string }>(url, {
      ...options,
      next: {
        ...options.next,
      },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { cartItems: [], totalQuantity: 0, error: errorResponse.error.message };
    }

    const rawItems = data[0]?.attributes.cart_items.data || [];

    const cartItems = rawItems.map((item) => {
      const { quantity, book } = item.attributes;
      const bookData = item.attributes.book?.data?.attributes;
      const imageUrl = bookData?.image?.data?.attributes?.url || "";

      return { quantity, book, imageUrl };
    });

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cartItems,
      totalQuantity,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("cart");

    return {
      cartItems: [],
      totalQuantity: 0,
      error: errorMessage,
    };
  }
};
