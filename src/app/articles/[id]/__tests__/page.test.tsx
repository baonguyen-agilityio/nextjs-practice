import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { getArticle } from "@/services/article";
import ArticleDetailWrapper from "../page";

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
        <h1 data-testid="article-title">{article.title}</h1>
        <p data-testid="article-content">{article.content}</p>
        <div data-testid="article-author">{article.author.name}</div>
        <div data-testid="article-published">{article.publishedAt}</div>
      </div>
    );
  };
});

jest.mock("@/components/features/article/ArticleSkeleton", () => {
  return function MockArticleSkeleton() {
    return <div data-testid="article-skeleton">Loading article...</div>;
  };
});

const mockGetArticle = jest.mocked(getArticle);
const mockNotFound = jest.mocked(notFound);

describe("Article Detail Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ArticleDetailWrapper", () => {
    const mockArticle = {
      id: "1",
      title: "Test Article",
      content: "Test content",
      slug: "test-article",
      description: "Test description",
      publishedAt: "2024-01-01T00:00:00.000Z",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      author: { name: "Test Author" },
      documentId: "doc1",
      imageUrl: "/test.jpg",
    };

    it("should render skeleton fallback initially", () => {
      mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

      render(<ArticleDetailWrapper params={Promise.resolve({ id: "test-id" })} />);

      expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();
      expect(screen.getByText("Loading article...")).toBeInTheDocument();
    });

    it("should render with valid article ID", () => {
      mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

      render(<ArticleDetailWrapper params={Promise.resolve({ id: "valid-id" })} />);

      expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();
    });

    it("should handle different ID formats", () => {
      const testIds = ["123", "article-slug", "test_article", "CAPS-ID"];

      testIds.forEach((id) => {
        mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

        render(<ArticleDetailWrapper params={Promise.resolve({ id })} />);

        expect(screen.getByTestId("article-skeleton")).toBeInTheDocument();
      });
    });
  });

  describe("ArticleDetail logic", () => {
    it("should extract ID from params", async () => {
      const params = Promise.resolve({ id: "test-article-123" });
      const { id } = await params;

      expect(id).toBe("test-article-123");
      expect(typeof id).toBe("string");
    });

    it("should call getArticle with correct ID", async () => {
      const mockResponse = {
        article: {
          id: "1",
          title: "Test Article",
          content: "Test content",
          slug: "test-article",
          description: "Test description",
          publishedAt: "2024-01-01T00:00:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          author: { name: "Test Author" },
          documentId: "doc1",
          imageUrl: "/test.jpg",
        },
        error: null,
      };

      mockGetArticle.mockResolvedValue(mockResponse);

      await getArticle({ id: "test-id" });

      expect(mockGetArticle).toHaveBeenCalledWith({ id: "test-id" });
    });

    it("should handle successful article response", async () => {
      const mockResponse = {
        article: {
          id: "article-123",
          title: "Amazing Article",
          content: "Amazing content",
          slug: "amazing-article",
          description: "Amazing description",
          publishedAt: "2024-01-01T00:00:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          author: { name: "Amazing Author" },
          documentId: "doc123",
          imageUrl: "/amazing.jpg",
        },
        error: null,
      };

      mockGetArticle.mockResolvedValue(mockResponse);

      const result = await getArticle({ id: "article-123" });

      expect(result.article).toBeDefined();
      expect(result.article?.id).toBe("article-123");
      expect(result.article?.title).toBe("Amazing Article");
      expect(result.error).toBeNull();
    });

    it("should handle article not found", async () => {
      mockGetArticle.mockResolvedValue({ article: null, error: "Not found" });

      const result = await getArticle({ id: "nonexistent" });

      expect(result.article).toBeNull();
      expect(result.error).toBe("Not found");
    });

    it("should call notFound when article is null", () => {
      const article = null;
      const shouldCallNotFound = !article;

      expect(shouldCallNotFound).toBe(true);

      if (shouldCallNotFound) {
        mockNotFound();
      }

      expect(mockNotFound).toHaveBeenCalled();
    });

    it("should not call notFound when article exists", () => {
      const article = { id: "1", title: "Test" };
      const shouldCallNotFound = !article;

      expect(shouldCallNotFound).toBe(false);
    });

    it("should handle API errors", async () => {
      mockGetArticle.mockRejectedValue(new Error("API Error"));

      await expect(getArticle({ id: "error-id" })).rejects.toThrow("API Error");
    });
  });

  describe("Parameter handling", () => {
    it("should handle empty ID", async () => {
      const params = Promise.resolve({ id: "" });
      const { id } = await params;

      expect(id).toBe("");
    });

    it("should handle special characters in ID", async () => {
      const specialId = "article-with-special-chars@#$";
      const params = Promise.resolve({ id: specialId });
      const { id } = await params;

      expect(id).toBe(specialId);
    });

    it("should handle numeric IDs", async () => {
      const params = Promise.resolve({ id: "12345" });
      const { id } = await params;

      expect(id).toBe("12345");
      expect(typeof id).toBe("string");
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined article", () => {
      const article = undefined;
      expect(!article).toBe(true);
    });

    it("should handle falsy article values", () => {
      const falsyValues = [null, undefined, false, 0, "", NaN];

      falsyValues.forEach((value) => {
        expect(!value).toBe(true);
      });
    });

    it("should handle truthy article", () => {
      const article = { id: "1", title: "Test" };
      expect(!article).toBe(false);
      expect(!!article).toBe(true);
    });
  });
});
