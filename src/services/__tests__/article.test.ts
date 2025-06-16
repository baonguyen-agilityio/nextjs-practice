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
    it("should successfully fetch articles", async () => {
      const mockArticlesData = [
        {
          id: "1",
          title: "Test Article 1",
          content: "Content 1",
          image: { url: "https://example.com/image1.jpg" },
        },
        {
          id: "2",
          title: "Test Article 2",
          content: "Content 2",
          image: { url: "https://example.com/image2.jpg" },
        },
      ];

      const mockResponse = {
        data: mockArticlesData,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 2,
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
            title: "Test Article 1",
            content: "Content 1",
            imageUrl: "https://example.com/image1.jpg",
          },
          {
            id: "2",
            title: "Test Article 2",
            content: "Content 2",
            imageUrl: "https://example.com/image2.jpg",
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 2,
        },
        error: null,
      });
    });

    it("should handle API error response", async () => {
      const mockErrorResponse = {
        data: [],
        meta: {},
        error: JSON.stringify({
          error: { message: "Server error" },
        }),
      };

      mockApiClient.get.mockResolvedValue(mockErrorResponse);

      const result = await getArticles({});

      expect(result).toEqual({
        articles: [],
        error: "Server error",
      });
    });

    it("should handle network errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));

      const result = await getArticles({});

      expect(result).toEqual({
        articles: [],
        error: "Network error",
      });
    });
  });

  describe("getArticle", () => {
    it("should successfully fetch single article", async () => {
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

    it("should handle missing image", async () => {
      const mockArticleData = {
        id: "1",
        title: "Test Article",
        content: "Test content",
        image: {},
      };

      const mockResponse = {
        data: mockArticleData,
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getArticle({ id: "1" });

      expect(result.article?.imageUrl).toBe("");
    });
  });
});
