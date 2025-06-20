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
    it("should fetch categories successfully", async () => {
      const mockCategoriesData = [
        { id: "1", name: "Fiction", description: "Fiction books" },
        { id: "2", name: "Non-Fiction", description: "Non-fiction books" },
      ];

      const mockResponse = { data: mockCategoriesData, error: null };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getCategories();

      expect(mockApiClient.get).toHaveBeenCalledWith("/api/categories", {
        cache: "force-cache",
        next: { tags: ["categories"] },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        data: mockCategoriesData,
        error: null,
      });
    });

    it("should handle empty data and API errors", async () => {
      const mockResponse = { data: [], error: null };
      mockApiClient.get.mockResolvedValue(mockResponse);

      let result = await getCategories();
      expect(result).toEqual({ data: [], error: null });

      const errorResponse = {
        data: [],
        error: JSON.stringify({
          error: { message: "Categories not found" },
        }),
      };

      mockApiClient.get.mockResolvedValue(errorResponse);
      result = await getCategories();
      expect(result).toEqual({
        data: [],
        error: "Categories not found",
      });
    });

    it("should handle errors and malformed JSON", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));
      let result = await getCategories();
      expect(result).toEqual({
        data: [],
        error: "Network error",
      });

      mockApiClient.get.mockRejectedValue("Unexpected error");
      result = await getCategories();
      expect(result).toEqual({
        data: [],
        error: "Failed to get category",
      });

      const malformedResponse = { data: [], error: "invalid json {" };
      mockApiClient.get.mockResolvedValue(malformedResponse);
      result = await getCategories();
      expect(result).toEqual({
        data: [],
        error: expect.stringContaining("Unexpected token"),
      });
    });
  });
});
