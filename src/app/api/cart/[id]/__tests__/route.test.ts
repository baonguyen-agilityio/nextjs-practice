import { DELETE } from "../route";

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
  constructor(
    public url: string,
    public init?: RequestInit
  ) {}

  async json() {
    return this.init?.body ? JSON.parse(this.init.body as string) : {};
  }
} as any;

jest.mock("@/services/api", () => ({
  apiClient: {
    delete: jest.fn(),
  },
}));

jest.mock("@/constants/api", () => ({
  API_ENDPOINTS: {
    CART_ITEMS: "/cart-items",
  },
}));

import { apiClient } from "@/services/api";

describe("Cart Item DELETE API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("DELETE /api/cart/[id]", () => {
    it("should successfully delete a cart item", async () => {
      const deleteResponse = { success: true, message: "Cart item deleted successfully" };
      mockApiClient.delete.mockResolvedValue(deleteResponse);

      const request = new Request("http://localhost:3000/api/cart/item-123") as any;
      const params = Promise.resolve({ id: "item-123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(mockApiClient.delete).toHaveBeenCalledWith("/cart-items/item-123");
      expect(result).toEqual(deleteResponse);
      expect(response.status).toBe(200);
    });

    it("should handle item not found error", async () => {
      const notFoundError = {
        error: {
          status: 404,
          name: "NotFoundError",
          message: "Cart item not found",
        },
      };

      mockApiClient.delete.mockResolvedValue(notFoundError);

      const request = new Request("http://localhost:3000/api/cart/nonexistent") as any;
      const params = Promise.resolve({ id: "nonexistent" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(notFoundError);
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockApiClient.delete.mockRejectedValue(networkError);

      const request = new Request("http://localhost:3000/api/cart/item-123") as any;
      const params = Promise.resolve({ id: "item-123" });

      await expect(DELETE(request, { params })).rejects.toThrow("Network connection failed");
    });

    it("should handle server errors", async () => {
      const serverError = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Failed to delete cart item",
        },
      };

      mockApiClient.delete.mockResolvedValue(serverError);

      const request = new Request("http://localhost:3000/api/cart/item-123") as any;
      const params = Promise.resolve({ id: "item-123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(serverError);
    });

    it("should handle different ID formats", async () => {
      const deleteResponse = { success: true };
      mockApiClient.delete.mockResolvedValue(deleteResponse);

      const request1 = new Request(
        "http://localhost:3000/api/cart/550e8400-e29b-41d4-a716-446655440000"
      ) as any;
      const params1 = Promise.resolve({ id: "550e8400-e29b-41d4-a716-446655440000" });

      await DELETE(request1, { params: params1 });

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        "/cart-items/550e8400-e29b-41d4-a716-446655440000"
      );

      const request2 = new Request("http://localhost:3000/api/cart/123") as any;
      const params2 = Promise.resolve({ id: "123" });

      await DELETE(request2, { params: params2 });

      expect(mockApiClient.delete).toHaveBeenCalledWith("/cart-items/123");
    });

    it("should handle permission errors", async () => {
      const permissionError = {
        error: {
          status: 403,
          name: "ForbiddenError",
          message: "You don't have permission to delete this cart item",
        },
      };

      mockApiClient.delete.mockResolvedValue(permissionError);

      const request = new Request("http://localhost:3000/api/cart/item-123") as any;
      const params = Promise.resolve({ id: "item-123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(permissionError);
    });
  });
});
