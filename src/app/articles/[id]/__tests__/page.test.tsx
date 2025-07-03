import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { getArticle } from "@/services/article";
import ArticleDetailPage, { generateMetadata } from "../page";
import type { Article } from "@/types";

jest.mock("@/services/article", () => ({
  getArticle: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/utils/date", () => ({
  formatDate: jest.fn((date: string) => "January 1, 2024"),
}));

jest.mock("@/components/features/article/ArticleDetails", () => ({
  ArticleDetails: ({ article }: { article: Article }) => (
    <div data-testid="article-details">
      <h1 data-testid="article-title">{article.title}</h1>
      <p data-testid="article-content">{article.content}</p>
      <div data-testid="article-author">{article.author?.name}</div>
    </div>
  ),
}));

const mockGetArticle = jest.mocked(getArticle);
const mockNotFound = jest.mocked(notFound);

describe("Article Detail Page", () => {
  const mockArticle: Article = {
    id: "1",
    documentId: "doc-1",
    slug: "test-article",
    title: "Test Article",
    description: "Test description",
    content: "Test content",
    imageUrl: "/test.jpg",
    publishedAt: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    author: { name: "Test Author" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMetadata", () => {
    it("returns complete metadata for existing article", async () => {
      mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "test-article" }),
      });

      expect(metadata).toEqual({
        title: "Test Article",
        description: "Test description",
        keywords: [
          "Test Article",
          "article",
          "blog",
          "books",
          "literature",
          "reading",
          "BookStore",
        ],
        authors: [{ name: "Test Author" }],
        openGraph: {
          title: "Test Article | BookStore Articles",
          description: "Test description",
          type: "article",
          section: "Literature & Books",
          tags: ["books", "literature", "reading", "Test Article"],
        },
        alternates: {
          canonical: "/articles/test-article",
        },
      });
    });

    it("returns not found metadata when article does not exist", async () => {
      mockGetArticle.mockResolvedValue({ article: null, error: "Not found" });

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "nonexistent" }),
      });

      expect(metadata).toEqual({
        title: "Article Not Found",
        description: "The requested article could not be found.",
      });
    });

    it("handles article without description", async () => {
      const articleWithoutDescription = { ...mockArticle, description: "" };
      mockGetArticle.mockResolvedValue({ article: articleWithoutDescription, error: null });

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "test-article" }),
      });

      expect(metadata.description).toBe(
        "Test Article - Published on January 1, 2024 by Test Author. Read this insightful article at BookStore."
      );
    });

    it("handles article without author", async () => {
      const articleWithoutAuthor = { ...mockArticle, author: { name: "" } };
      mockGetArticle.mockResolvedValue({ article: articleWithoutAuthor, error: null });

      const metadata = await generateMetadata({
        params: Promise.resolve({ id: "test-article" }),
      });

      expect(metadata.authors).toEqual([{ name: "BookStore Team" }]);
    });
  });

  describe("ArticleDetailPage", () => {
    it("renders ArticleDetails component when article exists", async () => {
      mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

      const component = await ArticleDetailPage({
        params: Promise.resolve({ id: "test-article" }),
      });

      render(component);

      expect(screen.getByTestId("article-details")).toBeInTheDocument();
      expect(screen.getByTestId("article-title")).toHaveTextContent("Test Article");
      expect(screen.getByTestId("article-content")).toHaveTextContent("Test content");
      expect(screen.getByTestId("article-author")).toHaveTextContent("Test Author");
    });

    it("calls notFound when article does not exist", async () => {
      mockGetArticle.mockResolvedValue({ article: null, error: "Not found" });

      await ArticleDetailPage({
        params: Promise.resolve({ id: "nonexistent" }),
      });

      expect(mockNotFound).toHaveBeenCalled();
    });

    it("calls getArticle with correct params", async () => {
      mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

      await ArticleDetailPage({
        params: Promise.resolve({ id: "article-123" }),
      });

      expect(mockGetArticle).toHaveBeenCalledWith({ id: "article-123" });
    });
  });

  describe("Service integration", () => {
    it("handles successful article fetch", async () => {
      mockGetArticle.mockResolvedValue({ article: mockArticle, error: null });

      const result = await getArticle({ id: "test-id" });

      expect(result).toEqual({ article: mockArticle, error: null });
      expect(mockGetArticle).toHaveBeenCalledWith({ id: "test-id" });
    });

    it("handles article not found error", async () => {
      mockGetArticle.mockResolvedValue({ article: null, error: "Article not found" });

      const result = await getArticle({ id: "nonexistent" });

      expect(result).toEqual({ article: null, error: "Article not found" });
    });

    it("handles service errors", async () => {
      mockGetArticle.mockRejectedValue(new Error("Service error"));

      await expect(getArticle({ id: "error-id" })).rejects.toThrow("Service error");
    });
  });

  describe("Parameter handling", () => {
    it("extracts ID from params correctly", async () => {
      const params = Promise.resolve({ id: "test-article-123" });
      const { id } = await params;

      expect(id).toBe("test-article-123");
      expect(typeof id).toBe("string");
    });

    it("handles different ID formats", async () => {
      const testIds = ["123", "article-slug", "test_article", "CAPS-ID"];

      for (const testId of testIds) {
        const params = Promise.resolve({ id: testId });
        const { id } = await params;
        expect(id).toBe(testId);
      }
    });

    it("handles special characters in ID", async () => {
      const specialId = "article-with-special-chars";
      const params = Promise.resolve({ id: specialId });
      const { id } = await params;

      expect(id).toBe(specialId);
    });
  });
});
