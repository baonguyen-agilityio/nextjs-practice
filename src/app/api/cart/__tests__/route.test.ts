import { GET, POST, PUT } from "../route";
import type { CartStrapiResponse, CartItemStrapiResponse, CartItem } from "@/types";

global.Response = class Response {
  constructor(
    public body?: any,
    public init?: ResponseInit
  ) {}

  static json(data: any) {
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  }

  async json() {
    return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
  }

  get status() {
    return this.init?.status || 200;
  }
} as any;

global.Request = class Request {
  private _url: string;

  constructor(
    url: string,
    public init?: RequestInit
  ) {
    this._url = url;
  }

  async json() {
    return this.init?.body ? JSON.parse(this.init.body as string) : {};
  }

  get url() {
    return this._url;
  }
} as any;

global.URL = class URL {
  searchParams: URLSearchParams;

  constructor(url: string) {
    this.searchParams = new URLSearchParams();
  }
} as any;

jest.mock("@/services/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock("@/hocs/withAuth", () => ({
  withAuth: (handler: any) => (req: any) => handler(req, "Bearer mock-token"),
}));

import { apiClient } from "@/services/api";

describe("Cart API Route", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCartResponse: CartStrapiResponse = {
    data: [
      {
        id: "cart-123",
        cart_items: [
          {
            id: "item-1",
            quantity: 2,
            book: {
              id: "book-1",
              documentId: "book-doc-1",
              slug: "test-book",
              title: "Test Book",
              description: "A test book",
              price: 29.99,
              language: "en",
              categories: [],
              image: { url: "https://example.com/book.jpg" },
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z",
              publishedAt: "2024-01-01T00:00:00.000Z",
            },
          },
        ],
      },
    ],
  };

  describe("GET /api/cart", () => {
    it("should successfully retrieve user cart", async () => {
      mockApiClient.get.mockResolvedValue(mockCartResponse);

      const request = new Request("http://localhost:3000/api/cart") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith(expect.stringContaining("/carts?"), {
        headers: {
          Authorization: "Bearer mock-token",
        },
      });
      expect(result).toEqual(mockCartResponse);
      expect(response.status).toBe(200);
    });

    it("should handle authentication error", async () => {
      const authError = {
        error: {
          status: 401,
          message: "Authentication required",
        },
      };

      mockApiClient.get.mockResolvedValue(authError);

      const request = new Request("http://localhost:3000/api/cart") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result).toEqual(authError);
    });
  });

  describe("POST /api/cart", () => {
    const addItemData = {
      data: {
        cart: "cart-123",
        book: "book-1",
        quantity: 1,
      },
    };

    it("should successfully add new item to cart", async () => {
      const existingItemsResponse = { data: [] };
      const newItemResponse = {
        data: {
          id: "item-new",
          quantity: 1,
          book: {
            id: "book-1",
            title: "Test Book",
            price: 29.99,
          },
        },
      };

      mockApiClient.get.mockResolvedValue(existingItemsResponse);
      mockApiClient.post.mockResolvedValue(newItemResponse);

      const request = new Request("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify(addItemData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        expect.stringContaining("/cart-items?"),
        expect.objectContaining({
          headers: { Authorization: "Bearer mock-token" },
        })
      );
      expect(mockApiClient.post).toHaveBeenCalledWith(
        expect.stringContaining("/cart-items?"),
        expect.objectContaining({
          body: addItemData,
          headers: { Authorization: "Bearer mock-token" },
        })
      );
      expect(result).toEqual(newItemResponse);
    });

    it("should update quantity for existing item", async () => {
      const existingItem: CartItem = {
        id: "item-1",
        quantity: 2,
        book: {
          id: "book-1",
          imageUrl: "https://example.com/book.jpg",
          slug: "test-book",
          title: "Test Book",
          description: "A test book",
          price: 29.99,
          language: "en",
          categories: [],
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          publishedAt: "2024-01-01T00:00:00.000Z",
          documentId: "book-doc-1",
        },
        documentId: "item-doc-1",
      };

      const existingItemsResponse = { data: [existingItem] };
      const updatedItemResponse = {
        data: {
          ...existingItem,
          quantity: 3,
        },
      };

      mockApiClient.get.mockResolvedValue(existingItemsResponse);
      mockApiClient.put.mockResolvedValue(updatedItemResponse);

      const request = new Request("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify(addItemData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.put).toHaveBeenCalledWith(
        expect.stringContaining("/cart-items/item-doc-1?"),
        expect.objectContaining({
          body: {
            data: {
              quantity: 3,
            },
          },
          headers: { Authorization: "Bearer mock-token" },
        })
      );
      expect(result).toEqual(updatedItemResponse);
    });

    it("should handle validation errors", async () => {
      const validationError = {
        error: JSON.stringify({
          error: {
            status: 400,
            message: "Invalid cart data",
          },
        }),
      };

      mockApiClient.get.mockResolvedValue({ data: [] });
      mockApiClient.post.mockResolvedValue(validationError);

      const request = new Request("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify(addItemData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Invalid cart data");
      expect(response.status).toBe(400);
    });

    it("should handle server errors", async () => {
      mockApiClient.get.mockResolvedValue({ data: [] });
      mockApiClient.post.mockRejectedValue(new Error("Server error"));

      const request = new Request("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify(addItemData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Failed to add cart item.");
      expect(response.status).toBe(500);
    });
  });

  describe("PUT /api/cart", () => {
    const updateData = {
      data: {
        cartItemId: "item-1",
        quantity: 5,
      },
    };

    it("should successfully update cart item quantity", async () => {
      const updatedItemResponse: CartItemStrapiResponse = {
        data: {
          id: "item-1",
          quantity: 5,
          book: {
            id: "book-1",
            documentId: "book-doc-1",
            slug: "test-book",
            title: "Test Book",
            description: "A test book",
            price: 29.99,
            language: "en",
            categories: [],
            image: { url: "https://example.com/book.jpg" },
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            publishedAt: "2024-01-01T00:00:00.000Z",
          },
        },
      };

      mockApiClient.put.mockResolvedValue(updatedItemResponse);

      const request = new Request("http://localhost:3000/api/cart", {
        method: "PUT",
        body: JSON.stringify(updateData),
      }) as any;

      const response = await PUT(request);
      const result = await response.json();

      expect(mockApiClient.put).toHaveBeenCalledWith(
        expect.stringContaining("/cart-items/item-1?"),
        expect.objectContaining({
          body: {
            data: {
              quantity: 5,
            },
          },
          headers: { Authorization: "Bearer mock-token" },
        })
      );
      expect(result).toEqual(updatedItemResponse);
      expect(response.status).toBe(200);
    });

    it("should handle item not found error", async () => {
      const notFoundError = {
        error: {
          status: 404,
          message: "Cart item not found",
        },
      };

      mockApiClient.put.mockResolvedValue(notFoundError);

      const request = new Request("http://localhost:3000/api/cart", {
        method: "PUT",
        body: JSON.stringify(updateData),
      }) as any;

      const response = await PUT(request);
      const result = await response.json();

      expect(result).toEqual(notFoundError);
    });
  });
});
