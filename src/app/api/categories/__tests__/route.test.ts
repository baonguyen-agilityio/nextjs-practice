import { GET } from "../route";
import type { CategoryStrapiResponse } from "@/types";

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

jest.mock("@/services/api", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from "@/services/api";

describe("Categories API Route", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCategoriesResponse: CategoryStrapiResponse = {
    data: [
      {
        id: 1,
        name: "Fiction",
        documentId: "fiction-doc",
      },
      {
        id: 2,
        name: "Non-Fiction",
        documentId: "nonfiction-doc",
      },
    ],
    error: null,
  };

  describe("GET /api/categories", () => {
    it("should successfully retrieve all categories", async () => {
      mockApiClient.get.mockResolvedValue(mockCategoriesResponse);

      const response = await GET();
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/categories");
      expect(result).toEqual(mockCategoriesResponse);
      expect(response.status).toBe(200);
    });

    it("should handle empty categories list", async () => {
      const emptyCategoriesResponse: CategoryStrapiResponse = {
        data: [],
        error: null,
      };

      mockApiClient.get.mockResolvedValue(emptyCategoriesResponse);

      const response = await GET();
      const result = await response.json();

      expect(result.data).toHaveLength(0);
      expect(result.error).toBeNull();
    });

    it("should handle server errors", async () => {
      const serverError = {
        error: {
          status: 500,
          message: "Internal server error",
        },
      };

      mockApiClient.get.mockResolvedValue(serverError);

      const response = await GET();
      const result = await response.json();

      expect(result).toEqual(serverError);
    });
  });
});
