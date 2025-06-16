import { getCategories } from "../category";
import { apiClient } from "../api";

jest.mock("../api", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock("@/constants", () => ({
  API_ENDPOINTS: {
    CATEGORIES: "categories",
  },
  API_ROUTE_ENDPOINT: {
    CATEGORIES: "/api/categories",
  },
  DOMAIN: "https://api.example.com",
  EXCEPTION_ERROR_MESSAGE: {
    GET: jest.fn((resource) => `Failed to get ${resource}`),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Category Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategories", () => {
    it("should successfully fetch categories", async () => {
      const mockCategoriesData = [
        {
          id: "1",
          name: "Fiction",
          description: "Fiction books",
        },
        {
          id: "2",
          name: "Non-Fiction",
          description: "Non-fiction books",
        },
      ];

      const mockResponse = {
        data: mockCategoriesData,
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getCategories();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/categories", {
        cache: "force-cache",
        next: {
          tags: ["categories"],
        },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        data: mockCategoriesData,
        error: null,
      });
    });

    it("should handle API error response", async () => {
      const mockResponse = {
        data: [],
        error: JSON.stringify({
          error: {
            message: "Categories not found",
          },
        }),
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getCategories();

      expect(result).toEqual({
        data: [],
        error: "Categories not found",
      });
    });

    it("should handle network errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));

      const result = await getCategories();

      expect(result).toEqual({
        data: [],
        error: "Network error",
      });
    });

    it("should handle unexpected errors", async () => {
      mockApiClient.get.mockRejectedValue("Unexpected error");

      const result = await getCategories();

      expect(result).toEqual({
        data: [],
        error: "Failed to get category",
      });
    });

    it("should handle malformed error JSON", async () => {
      const mockResponse = {
        data: [],
        error: "invalid json {",
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getCategories();

      expect(result).toEqual({
        data: [],
        error: expect.stringContaining("Unexpected token"),
      });
    });

    it("should handle empty categories response", async () => {
      const mockResponse = {
        data: [],
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getCategories();

      expect(result).toEqual({
        data: [],
        error: null,
      });
    });
  });
});
