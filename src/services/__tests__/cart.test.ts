import { getCartByUserId, createCart, addCartItem, updateCartItem, removeCartItem } from "../cart";
import { apiClient } from "../api";
import { auth } from "@/lib/auth/auth";

jest.mock("../api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    apiClientSession: jest.fn(),
  },
}));

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/constants", () => ({
  API_ENDPOINTS: {
    CART: "/api/carts",
  },
  API_ROUTE_ENDPOINT: {
    CART: "/api/cart-items",
  },
  DOMAIN: "https://api.example.com",
  EXCEPTION_ERROR_MESSAGE: {
    GET: jest.fn((resource) => `Failed to get ${resource}`),
  },
  TAGS: {
    CART: "cart",
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockAuth = auth as any;

describe("Cart Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCartByUserId", () => {
    it("should successfully fetch user cart", async () => {
      const mockSession = {
        user: { id: "user-123" },
      };

      const mockCartData = [
        {
          id: "cart-1",
          cart_items: [
            {
              id: "item-1",
              quantity: 2,
              book: {
                id: "book-1",
                title: "Test Book",
                price: 29.99,
                image: { url: "https://example.com/image.jpg" },
              },
            },
            {
              id: "item-2",
              quantity: 1,
              book: {
                id: "book-2",
                title: "Another Book",
                price: 19.99,
                image: { url: "https://example.com/image2.jpg" },
              },
            },
          ],
        },
      ];

      const mockApiClientSession = {
        get: jest.fn().mockResolvedValue({
          data: mockCartData,
          error: null,
        }),
      };

      mockAuth.mockResolvedValue(mockSession);
      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await getCartByUserId();

      expect(mockAuth).toHaveBeenCalled();
      expect(mockApiClient.apiClientSession).toHaveBeenCalled();
      expect(mockApiClientSession.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/cart-items?"),
        expect.objectContaining({
          next: expect.objectContaining({
            tags: ["cart"],
            revalidate: 3600,
          }),
          baseUrl: "https://api.example.com",
        })
      );

      expect(result).toEqual({
        id: "cart-1",
        cartItems: [
          {
            id: "item-1",
            quantity: 2,
            book: {
              id: "book-1",
              title: "Test Book",
              price: 29.99,
              imageUrl: "https://example.com/image.jpg",
            },
          },
          {
            id: "item-2",
            quantity: 1,
            book: {
              id: "book-2",
              title: "Another Book",
              price: 19.99,
              imageUrl: "https://example.com/image2.jpg",
            },
          },
        ],
        totalQuantity: 3,
        cost: {
          totalAmount: 79.97,
        },
        error: null,
      });
    });

    it("should return undefined when no user session", async () => {
      mockAuth.mockResolvedValue(null);

      const result = await getCartByUserId();

      expect(result).toBeUndefined();
    });

    it("should filter out zero quantity items", async () => {
      const mockSession = {
        user: { id: "user-123" },
      };

      const mockCartData = [
        {
          id: "cart-1",
          cart_items: [
            {
              id: "item-1",
              quantity: 2,
              book: {
                id: "book-1",
                title: "Test Book",
                price: 29.99,
                image: { url: "https://example.com/image.jpg" },
              },
            },
            {
              id: "item-2",
              quantity: 0,
              book: {
                id: "book-2",
                title: "Another Book",
                price: 19.99,
                image: { url: "https://example.com/image2.jpg" },
              },
            },
          ],
        },
      ];

      const mockApiClientSession = {
        get: jest.fn().mockResolvedValue({
          data: mockCartData,
          error: null,
        }),
      };

      mockAuth.mockResolvedValue(mockSession);
      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await getCartByUserId();

      expect(result?.cartItems).toHaveLength(1);
      expect(result?.totalQuantity).toBe(2);
    });

    it("should handle API error", async () => {
      const mockSession = {
        user: { id: "user-123" },
      };

      const mockApiClientSession = {
        get: jest.fn().mockResolvedValue({
          data: [],
          error: JSON.stringify({
            error: { message: "Cart not found" },
          }),
        }),
      };

      mockAuth.mockResolvedValue(mockSession);
      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await getCartByUserId();

      expect(result).toEqual({
        id: "",
        cartItems: [],
        totalQuantity: 0,
        error: "Cart not found",
      });
    });
  });

  describe("createCart", () => {
    it("should successfully create cart", async () => {
      const mockSession = {
        user: { id: "user-123" },
      };

      const mockApiClientSession = {
        post: jest.fn().mockResolvedValue({
          data: { id: "new-cart-id" },
        }),
      };

      mockAuth.mockResolvedValue(mockSession);
      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await createCart();

      expect(mockApiClientSession.post).toHaveBeenCalledWith("/api/carts", {
        body: {
          data: {
            users_permissions_user: "user-123",
          },
        },
      });

      expect(result).toEqual({
        id: "new-cart-id",
      });
    });

    it("should handle user not found", async () => {
      mockAuth.mockResolvedValue(null);

      const result = await createCart();

      expect(result).toEqual({
        id: "",
        error: "User not found",
      });
    });
  });

  describe("addCartItem", () => {
    it("should successfully add cart item", async () => {
      const cartItemPayload = {
        bookId: "book-123",
        quantity: 2,
        cartId: "cart-456",
      };

      const mockResponse = {
        data: {
          id: "item-789",
          book: {
            id: "book-123",
            title: "Test Book",
            price: 29.99,
          },
          quantity: 2,
        },
        error: null,
      };

      const mockApiClientSession = {
        post: jest.fn().mockResolvedValue(mockResponse),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await addCartItem(cartItemPayload);

      expect(mockApiClientSession.post).toHaveBeenCalledWith("/api/cart-items", {
        body: {
          data: {
            book: "book-123",
            quantity: 2,
            cart: "cart-456",
          },
        },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        id: "item-789",
        book: {
          id: "book-123",
          title: "Test Book",
          price: 29.99,
        },
        quantity: 2,
      });
    });

    it("should handle add item error", async () => {
      const cartItemPayload = {
        bookId: "book-123",
        quantity: 2,
        cartId: "cart-456",
      };

      const mockApiClientSession = {
        post: jest.fn().mockResolvedValue({
          data: null,
          error: JSON.stringify({
            error: { message: "Book not found" },
          }),
        }),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await addCartItem(cartItemPayload);

      expect(result).toEqual({
        book: {},
        quantity: 0,
        id: "",
        error: "Book not found",
      });
    });
  });

  describe("updateCartItem", () => {
    it("should successfully update cart item", async () => {
      const updatePayload = {
        cartItemId: "item-123",
        quantity: 3,
      };

      const mockResponse = {
        data: {
          id: "item-123",
          book: {
            id: "book-123",
            title: "Test Book",
            price: 29.99,
          },
          quantity: 3,
        },
        error: null,
      };

      const mockApiClientSession = {
        put: jest.fn().mockResolvedValue(mockResponse),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await updateCartItem(updatePayload);

      expect(mockApiClientSession.put).toHaveBeenCalledWith("/api/cart-items", {
        body: {
          data: {
            cartItemId: "item-123",
            quantity: 3,
          },
        },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        id: "item-123",
        book: {
          id: "book-123",
          title: "Test Book",
          price: 29.99,
        },
        quantity: 3,
      });
    });
  });

  describe("removeCartItem", () => {
    it("should successfully remove cart item", async () => {
      const mockApiClientSession = {
        delete: jest.fn().mockResolvedValue({
          success: true,
        }),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await removeCartItem({ cartItemId: "item-123" });

      expect(mockApiClientSession.delete).toHaveBeenCalledWith("/api/cart-items/item-123", {
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({ success: true });
    });

    it("should handle remove item failure", async () => {
      const mockApiClientSession = {
        delete: jest.fn().mockResolvedValue({
          success: false,
        }),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await removeCartItem({ cartItemId: "item-123" });

      expect(result).toEqual({ error: "Failed to remove cart item" });
    });

    it("should handle network errors", async () => {
      mockApiClient.apiClientSession.mockRejectedValue(new Error("Network error"));

      const result = await removeCartItem({ cartItemId: "item-123" });

      expect(result).toEqual({ error: "Network error" });
    });
  });
});
