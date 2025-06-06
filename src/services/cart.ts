import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN, EXCEPTION_ERROR_MESSAGE } from "@/constants";
import { apiClient } from "./api";
import type {
  Cart,
  CartItem,
  CartItemPayload,
  CartStrapiResponse,
  ErrorResponse,
  Book,
} from "@/types";
import { auth } from "@/lib/auth/auth";

export const getCartByUserId = async (): Promise<Cart | undefined> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return undefined;
    }

    const searchParams = new URLSearchParams({
      "filters[users_permissions_user][id][$eq]": session.user.id.toString(),
    });
    const api = await apiClient.apiClientSession();
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.CART}?${searchParams.toString()}`);

    const { data, error } = await api.get<CartStrapiResponse & { error?: string }>(url, {
      next: {
        tags: [API_ENDPOINTS.CART],
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

export const createCart = async ({ userId }: { userId: string }): Promise<{ id: string }> => {
  const api = await apiClient.apiClientSession();

  const res = await api.post<{
    data: { id: string };
  }>(API_ENDPOINTS.CART, {
    body: {
      data: {
        users_permissions_user: userId,
      },
    },
  });

  return {
    id: res.data.id,
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
    return { book: {} as Book, quantity: 0, id: "", error: errorResponse.error.message };
  }

  return {
    book: data.book,
    quantity: data.quantity,
    id: data.id,
  };
};

export const updateCartItem = async ({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}): Promise<CartItem> => {
  const api = await apiClient.apiClientSession();
  const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.CART}`);

  const { data, error } = await api.put<{
    data: CartItem;
    error?: string;
  }>(url, {
    body: {
      data: {
        cartItemId: cartItemId,
        quantity: quantity,
      },
    },
    baseUrl: DOMAIN,
  });

  if (error) {
    const errorResponse = JSON.parse(error) as ErrorResponse;
    return { book: {} as Book, quantity: 0, id: "", error: errorResponse.error.message };
  }

  return {
    book: data.book,
    quantity: data.quantity,
    id: data.id,
  };
};
