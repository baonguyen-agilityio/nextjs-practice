import { getArticles, getArticle } from "../article";
import { apiClient } from "../api";

jest.mock("../api", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

jest.mock("@/constants", () => ({
  API_ENDPOINTS: {
    ARTICLES: "articles",
  },
  API_ROUTE_ENDPOINT: {
    ARTICLES: "/api/articles",
  },
  DOMAIN: "https://api.example.com",
}));

jest.mock("@/constants/message", () => ({
  EXCEPTION_ERROR_MESSAGE: {
    GET: jest.fn((resource) => `Failed to get ${resource}`),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Article Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getArticles", () => {
    it("should fetch articles with pagination", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            title: "Test Article",
            content: "Content",
            image: { url: "https://example.com/image.jpg" },
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 1,
          },
        },
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const searchParams = new URLSearchParams("page=1");
      const result = await getArticles({ searchParams });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/articles?page=1",
        expect.objectContaining({
          next: expect.objectContaining({
            tags: ["articles"],
            revalidate: 3600,
          }),
          baseUrl: "https://api.example.com",
        })
      );

      expect(result).toEqual({
        articles: [
          {
            id: "1",
            title: "Test Article",
            content: "Content",
            imageUrl: "https://example.com/image.jpg",
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 1,
        },
        error: null,
      });
    });

    it("should handle errors", async () => {
      // Test API error response
      const mockErrorResponse = {
        data: [],
        meta: {},
        error: JSON.stringify({
          error: { message: "Server error" },
        }),
      };

      mockApiClient.get.mockResolvedValue(mockErrorResponse);
      let result = await getArticles({});

      expect(result).toEqual({
        articles: [],
        error: "Server error",
      });

      // Test network error
      mockApiClient.get.mockRejectedValue(new Error("Network error"));
      result = await getArticles({});

      expect(result).toEqual({
        articles: [],
        error: "Network error",
      });
    });
  });

  describe("getArticle", () => {
    it("should fetch single article with image handling", async () => {
      const mockArticleData = {
        id: "1",
        title: "Test Article",
        content: "Test content",
        image: { url: "https://example.com/image.jpg" },
      };

      const mockResponse = {
        data: mockArticleData,
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getArticle({ id: "1" });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/articles/1",
        expect.objectContaining({
          next: expect.objectContaining({
            tags: ["articles", "1"],
            revalidate: 3600,
          }),
          baseUrl: "https://api.example.com",
        })
      );

      expect(result).toEqual({
        article: {
          id: "1",
          title: "Test Article",
          content: "Test content",
          imageUrl: "https://example.com/image.jpg",
        },
        error: null,
      });

      // Test missing image
      mockResponse.data.image = {} as any;
      mockApiClient.get.mockResolvedValue(mockResponse);

      const resultWithoutImage = await getArticle({ id: "1" });
      expect(resultWithoutImage.article?.imageUrl).toBe("");
    });

    it("should handle article not found", async () => {
      const mockResponse = {
        data: null,
        error: JSON.stringify({
          error: { message: "Article not found" },
        }),
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getArticle({ id: "999" });

      expect(result).toEqual({
        article: null,
        error: "Article not found",
      });
    });
  });
});
