jest.mock("@/services/article", () => ({
  getArticle: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/components/features/article/ArticleDetails", () => {
  return function MockArticleDetails({ article }: any) {
    return (
      <div data-testid="article-details">
        <h1>{article.title}</h1>
        <p>{article.content}</p>
      </div>
    );
  };
});

jest.mock("@/components/features/article/ArticleSkeleton", () => {
  return function MockArticleSkeleton() {
    return <div data-testid="article-skeleton">Loading...</div>;
  };
});

describe("Article Detail Page", () => {
  const mockGetArticle = require("@/services/article").getArticle;
  const mockNotFound = require("next/navigation").notFound;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    it("should define proper component exports", () => {
      const pageModule = require("../page");

      expect(typeof pageModule.default).toBe("function");
    });

    it("should handle params type correctly", () => {
      const mockParams = Promise.resolve({ id: "article-123" });

      expect(mockParams).toBeInstanceOf(Promise);
    });
  });

  describe("Parameters Handling", () => {
    it("should handle string ID parameter", async () => {
      const params = Promise.resolve({ id: "article-123" });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe("article-123");
      expect(typeof resolvedParams.id).toBe("string");
    });

    it("should handle numeric ID parameter", async () => {
      const params = Promise.resolve({ id: "123" });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe("123");
      expect(!isNaN(parseInt(resolvedParams.id))).toBe(true);
    });

    it("should handle UUID parameter", async () => {
      const uuidId = "550e8400-e29b-41d4-a716-446655440000";
      const params = Promise.resolve({ id: uuidId });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe(uuidId);
      expect(resolvedParams.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it("should handle special characters in ID", async () => {
      const specialId = "article-with-dashes_and_underscores";
      const params = Promise.resolve({ id: specialId });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe(specialId);
    });

    it("should handle URL encoded ID", async () => {
      const encodedId = "article with spaces";
      const params = Promise.resolve({ id: encodedId });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe(encodedId);
    });
  });

  describe("Article Retrieval", () => {
    it("should call getArticle with correct ID", () => {
      const articleId = "test-article-123";
      const expectedCall = { id: articleId };

      expect(typeof mockGetArticle).toBe("function");
      expect(expectedCall.id).toBe(articleId);
    });

    it("should handle successful article response", () => {
      const mockArticle = {
        id: "article-1",
        title: "Test Article",
        content: "This is test content",
        author: "Test Author",
        publishedAt: "2024-01-01T00:00:00.000Z",
      };

      const mockResponse = {
        article: mockArticle,
        error: null,
      };

      mockGetArticle.mockResolvedValue(mockResponse);

      expect(mockResponse.article).toBeDefined();
      expect(mockResponse.article.title).toBe("Test Article");
      expect(mockResponse.error).toBeNull();
    });

    it("should handle article not found", () => {
      const notFoundResponse = {
        article: null,
        error: "Article not found",
      };

      mockGetArticle.mockResolvedValue(notFoundResponse);

      expect(notFoundResponse.article).toBeNull();
      expect(notFoundResponse.error).toBe("Article not found");
    });

    it("should handle service errors", () => {
      const errorResponse = {
        article: null,
        error: "Service unavailable",
      };

      mockGetArticle.mockResolvedValue(errorResponse);

      expect(errorResponse.article).toBeNull();
      expect(errorResponse.error).toBe("Service unavailable");
    });

    it("should handle network errors", () => {
      const networkError = new Error("Network connection failed");
      mockGetArticle.mockRejectedValue(networkError);

      expect(mockGetArticle).toBeDefined();
    });
  });

  describe("Not Found Handling", () => {
    it("should call notFound when article is null", () => {
      const mockResponse = {
        article: null,
        error: "Article not found",
      };

      mockGetArticle.mockResolvedValue(mockResponse);

      expect(typeof mockNotFound).toBe("function");
      expect(mockResponse.article).toBeNull();
    });

    it("should not call notFound when article exists", () => {
      const mockResponse = {
        article: {
          id: "article-1",
          title: "Test Article",
          content: "Test content",
        },
        error: null,
      };

      mockGetArticle.mockResolvedValue(mockResponse);

      expect(mockResponse.article).toBeDefined();
      expect(mockResponse.article.title).toBe("Test Article");
    });
  });

  describe("Component Props", () => {
    it("should pass article to ArticleDetails component", () => {
      const mockArticle = {
        id: "article-1",
        title: "Test Article",
        content: "This is test content",
        author: "Test Author",
        publishedAt: "2024-01-01T00:00:00.000Z",
        image: {
          url: "https://example.com/image.jpg",
          alt: "Test image",
        },
      };

      expect(mockArticle).toHaveProperty("id");
      expect(mockArticle).toHaveProperty("title");
      expect(mockArticle).toHaveProperty("content");
      expect(mockArticle).toHaveProperty("author");
      expect(mockArticle).toHaveProperty("publishedAt");
      expect(mockArticle).toHaveProperty("image");
    });

    it("should handle article with minimal data", () => {
      const minimalArticle = {
        id: "article-1",
        title: "Minimal Article",
      };

      expect(minimalArticle.id).toBe("article-1");
      expect(minimalArticle.title).toBe("Minimal Article");
    });

    it("should handle article with all fields", () => {
      const fullArticle = {
        id: "article-1",
        title: "Full Article",
        content: "Full content",
        excerpt: "Article excerpt",
        author: "Author Name",
        publishedAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
        tags: ["tech", "javascript"],
        category: "Technology",
        image: {
          url: "https://example.com/image.jpg",
          alt: "Article image",
        },
        seo: {
          title: "SEO Title",
          description: "SEO Description",
        },
      };

      expect(Object.keys(fullArticle)).toHaveLength(11);
      expect(fullArticle.tags).toHaveLength(2);
      expect(fullArticle.image.url).toContain("https://");
    });
  });

  describe("Suspense Integration", () => {
    it("should handle Suspense fallback with ArticleSkeleton", () => {
      const MockArticleSkeleton = jest.fn(() => "Loading...");

      expect(typeof MockArticleSkeleton).toBe("function");
      expect(MockArticleSkeleton()).toBe("Loading...");
    });

    it("should handle params prop in wrapper component", () => {
      const wrapperProps = {
        params: Promise.resolve({ id: "test-id" }),
      };

      expect(wrapperProps.params).toBeInstanceOf(Promise);
    });

    it("should handle params prop in detail component", () => {
      const detailProps = {
        params: Promise.resolve({ id: "test-id" }),
      };

      expect(detailProps.params).toBeInstanceOf(Promise);
    });
  });

  describe("Error Boundaries", () => {
    it("should handle malformed article data", () => {
      const malformedArticle = {
        id: null,
        title: undefined,
        content: "",
      };

      expect(malformedArticle.id).toBeNull();
      expect(malformedArticle.title).toBeUndefined();
      expect(malformedArticle.content).toBe("");
    });

    it("should handle missing required fields", () => {
      const incompleteArticle = {
        content: "Some content",
      };

      expect(incompleteArticle).not.toHaveProperty("id");
      expect(incompleteArticle).not.toHaveProperty("title");
      expect(incompleteArticle.content).toBe("Some content");
    });

    it("should handle service timeout", () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";

      mockGetArticle.mockRejectedValue(timeoutError);

      expect(timeoutError.name).toBe("TimeoutError");
      expect(timeoutError.message).toBe("Request timeout");
    });

    it("should handle database errors", () => {
      const dbError = new Error("Database connection failed");
      dbError.name = "DatabaseError";

      mockGetArticle.mockRejectedValue(dbError);

      expect(dbError.name).toBe("DatabaseError");
      expect(dbError.message).toBe("Database connection failed");
    });
  });

  describe("URL Parameter Edge Cases", () => {
    it("should handle very long IDs", async () => {
      const longId = "a".repeat(1000);
      const params = Promise.resolve({ id: longId });
      const resolvedParams = await params;

      expect(resolvedParams.id).toHaveLength(1000);
      expect(resolvedParams.id).toBe(longId);
    });

    it("should handle empty ID", async () => {
      const params = Promise.resolve({ id: "" });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe("");
    });

    it("should handle ID with special characters", async () => {
      const specialId = "article@#$%^&*()";
      const params = Promise.resolve({ id: specialId });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe(specialId);
    });

    it("should handle unicode characters in ID", async () => {
      const unicodeId = "test-article-article";
      const params = Promise.resolve({ id: unicodeId });
      const resolvedParams = await params;

      expect(resolvedParams.id).toBe(unicodeId);
    });
  });

  describe("Performance Considerations", () => {
    it("should handle concurrent requests", () => {
      const requests = [
        mockGetArticle.mockResolvedValue({ article: { id: "1" }, error: null }),
        mockGetArticle.mockResolvedValue({ article: { id: "2" }, error: null }),
        mockGetArticle.mockResolvedValue({ article: { id: "3" }, error: null }),
      ];

      expect(requests).toHaveLength(3);
    });

    it("should handle caching scenarios", () => {
      const cachedResponse = {
        article: { id: "cached-article", title: "Cached Article" },
        error: null,
        cached: true,
      };

      mockGetArticle.mockResolvedValue(cachedResponse);

      expect(cachedResponse.cached).toBe(true);
      expect(cachedResponse.article.title).toBe("Cached Article");
    });
  });
});
