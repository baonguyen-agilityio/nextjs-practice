import {
  API_ENDPOINTS,
  API_ROUTE_ENDPOINT,
  DOMAIN,
  EXCEPTION_ERROR_MESSAGE,
  TAGS,
} from "@/constants";
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
        revalidate: 3600,
        tags: [TAGS.CART],
      },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { id: "", cartItems: [], totalQuantity: 0, error: errorResponse.error.message };
    }

    const rawItems = data[0]?.cart_items || [];

    const cartItems = rawItems
      .filter((item) => item.quantity > 0)
      .map(({ quantity, book, ...rest }) => {
        const { image, ...bookData } = book || {};
        const imageUrl = image.url;

        return {
          quantity,
          book: { ...bookData, imageUrl },
          ...rest,
        };
      });

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

    return {
      id: data[0]?.id || "",
      cartItems: cartItems,
      totalQuantity: totalQuantity,
      cost: {
        totalAmount: totalAmount,
      },
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

export const createCart = async (): Promise<{ id: string; error?: string }> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { id: "", error: "User not found" };
    }

    const api = await apiClient.apiClientSession();

    const res = await api.post<{
      data: { id: string };
    }>(API_ENDPOINTS.CART, {
      body: {
        data: {
          users_permissions_user: session.user.id,
        },
      },
    });

    return {
      id: res.data.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("cart");

    return {
      id: "",
      error: errorMessage,
    };
  }
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

export const removeCartItem = async ({
  cartItemId,
}: {
  cartItemId: string;
}): Promise<{ success: true } | { error: string }> => {
  try {
    const api = await apiClient.apiClientSession();
    const { success } = await api.delete<{ success: boolean }>(
      `${API_ROUTE_ENDPOINT.CART}/${cartItemId}`,
      {
        baseUrl: DOMAIN,
      }
    );

    if (!success) {
      return { error: "Failed to remove cart item" };
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("cart");

    return { error: errorMessage };
  }
};
