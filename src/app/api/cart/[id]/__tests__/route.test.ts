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

import { apiClient } from "@/services/api";

describe("Cart Item DELETE API Route", () => {
  const mockApiClient = apiClient as any;

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
  });
});
