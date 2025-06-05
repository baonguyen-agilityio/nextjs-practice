import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN, EXCEPTION_ERROR_MESSAGE } from "@/constants";
import { apiClient } from "./api";
import type {
  Cart,
  CartItem,
  CartItemPayload,
  CartStrapiResponse,
  ErrorResponse,
  FetchDataProps,
} from "@/types";

export const getCartByUserId = async ({
  searchParams = new URLSearchParams(),
  options = { next: { tags: [API_ENDPOINTS.CART] } },
}: FetchDataProps): Promise<Cart> => {
  try {
    const params = new URLSearchParams(searchParams);
    const api = await apiClient.apiClientSession();
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.CART}?${params.toString()}`);

    const { data, error } = await api.get<CartStrapiResponse & { error?: string }>(url, {
      ...options,
      next: {
        ...options.next,
      },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { id: "", cartItems: [], totalQuantity: 0, error: errorResponse.error.message };
    }

    const rawItems = data[0]?.cart_items || [];

    const cartItems = rawItems.map(({ quantity, book, ...rest }) => {
      const { image, ...bookData } = book || {};
      const imageUrl = image.url;

      return {
        quantity,
        book: { ...bookData, imageUrl },
        ...rest,
      };
    });

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: data[0]?.id || "",
      cartItems: cartItems,
      totalQuantity: totalQuantity,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("cart");

    return {
      id: "",
      cartItems: [],
      totalQuantity: 0,
      error: errorMessage,
    };
  }
};

export const createCart = async ({ userId }: { userId: string }): Promise<Cart> => {
  const api = await apiClient.apiClientSession();
  const url = decodeURIComponent(`${API_ENDPOINTS.CART}`);

  const { data, error } = await api.post<{
    data: Cart;
    error?: string;
  }>(url, {
    body: {
      data: {
        users_permissions_user: userId,
      },
    },
    baseUrl: DOMAIN,
  });

  if (error) {
    const errorResponse = JSON.parse(error) as ErrorResponse;
    return { id: "", cartItems: [], totalQuantity: 0, error: errorResponse.error.message };
  }

  return {
    id: data.id,
    cartItems: [],
    totalQuantity: 0,
    error: null,
  };
};

export const addCartItem = async ({
  bookId,
  quantity,
  cartId,
}: CartItemPayload): Promise<CartItem> => {
  const api = await apiClient.apiClientSession();
  const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.CART}`);

  const { data, error } = await api.post<{
    data: CartItem;
    error?: string;
  }>(url, {
    body: {
      data: {
        book: bookId,
        quantity: quantity,
        cart: cartId,
      },
    },
    baseUrl: DOMAIN,
  });

  if (error) {
    const errorResponse = JSON.parse(error) as ErrorResponse;
    return { book: null, quantity: 0, id: "", error: errorResponse.error.message };
  }

  return {
    book: data.book,
    quantity: data.quantity,
    id: data.id,
  };
};
