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

jest.mock("@/constants/api", () => ({
  API_ENDPOINTS: {
    CATEGORIES: "/categories",
  },
}));

import { apiClient } from "@/services/api";

describe("Categories API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

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
      {
        id: 3,
        name: "Science",
        documentId: "science-doc",
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
          name: "InternalServerError",
          message: "Internal server error",
        },
      };

      mockApiClient.get.mockResolvedValue(serverError);

      const response = await GET();
      const result = await response.json();

      expect(result).toEqual(serverError);
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockApiClient.get.mockRejectedValue(networkError);

      await expect(GET()).rejects.toThrow("Network connection failed");
    });

    it("should handle database connection errors", async () => {
      const dbError = {
        error: {
          status: 503,
          name: "ServiceUnavailableError",
          message: "Database connection failed",
        },
      };

      mockApiClient.get.mockResolvedValue(dbError);

      const response = await GET();
      const result = await response.json();

      expect(result).toEqual(dbError);
    });

    it("should return proper data structure", async () => {
      mockApiClient.get.mockResolvedValue(mockCategoriesResponse);

      const response = await GET();
      const result = await response.json();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        expect(result.data[0]).toHaveProperty("id");
        expect(result.data[0]).toHaveProperty("name");
        expect(result.data[0]).toHaveProperty("documentId");
        expect(typeof result.data[0].id).toBe("number");
        expect(typeof result.data[0].name).toBe("string");
      }
    });

    it("should handle categories with special characters", async () => {
      const specialCategoriesResponse: CategoryStrapiResponse = {
        data: [
          {
            id: 1,
            name: "Science & Technology",
            documentId: "science-tech-doc",
          },
          {
            id: 2,
            name: "Arts & Crafts",
            documentId: "arts-crafts-doc",
          },
        ],
        error: null,
      };

      mockApiClient.get.mockResolvedValue(specialCategoriesResponse);

      const response = await GET();
      const result = await response.json();

      expect(result.data[0].name).toBe("Science & Technology");
      expect(result.data[1].name).toBe("Arts & Crafts");
    });

    it("should handle unicode category names", async () => {
      const unicodeCategoriesResponse: CategoryStrapiResponse = {
        data: [
          {
            id: 1,
            name: "Философия",
            documentId: "philosophy-doc",
          },
          {
            id: 2,
            name: "文学",
            documentId: "literature-doc",
          },
        ],
        error: null,
      };

      mockApiClient.get.mockResolvedValue(unicodeCategoriesResponse);

      const response = await GET();
      const result = await response.json();

      expect(result.data[0].name).toBe("Философия");
      expect(result.data[1].name).toBe("文学");
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      mockApiClient.get.mockRejectedValue(timeoutError);

      await expect(GET()).rejects.toThrow("Request timeout");
    });

    it("should handle API rate limiting", async () => {
      const rateLimitError = {
        error: {
          status: 429,
          name: "TooManyRequestsError",
          message: "Too many requests. Please try again later.",
        },
      };

      mockApiClient.get.mockResolvedValue(rateLimitError);

      const response = await GET();
      const result = await response.json();

      expect(result).toEqual(rateLimitError);
    });

    it("should handle partial data with some invalid categories", async () => {
      const partialCategoriesResponse: CategoryStrapiResponse = {
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
        error: "Some categories could not be loaded",
      };

      mockApiClient.get.mockResolvedValue(partialCategoriesResponse);

      const response = await GET();
      const result = await response.json();

      expect(result.data).toHaveLength(2);
      expect(result.error).toBe("Some categories could not be loaded");
    });

    it("should handle malformed response data", async () => {
      const malformedResponse = {
        data: null,
        error: "Invalid response format",
      };

      mockApiClient.get.mockResolvedValue(malformedResponse);

      const response = await GET();
      const result = await response.json();

      expect(result.data).toBeNull();
      expect(result.error).toBe("Invalid response format");
    });
  });
});
