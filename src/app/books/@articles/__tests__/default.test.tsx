import { render, screen } from "@testing-library/react";
import { getArticles } from "@/services/article";
import ArticlesPage from "../default";
import type { Article } from "@/types";

// Mock the getArticles service
jest.mock("@/services/article", () => ({
  getArticles: jest.fn(),
}));

// Mock ArticleCard component
jest.mock("@/components/features/article/ArticleCard", () => ({
  ArticleCard: ({ article }: { article: Article }) => (
    <div data-testid={`article-card-${article.id}`}>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
    </div>
  ),
}));

// Mock ArticlesEmptyState component
jest.mock("@/components/ui/EmptyState/variants", () => ({
  ArticlesEmptyState: () => (
    <div data-testid="articles-empty-state">
      <h3>No articles available</h3>
      <p>There are no articles to display at this time. Check back later for new content!</p>
    </div>
  ),
}));

const mockGetArticles = jest.mocked(getArticles);

describe("ArticlesPage", () => {
  const mockArticles: Article[] = [
    {
      id: "1",
      documentId: "doc-1",
      slug: "article-1",
      title: "Article 1",
      description: "Description 1",
      content: "Content 1",
      imageUrl: "/image1.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      publishedAt: "2024-01-01T00:00:00.000Z",
      author: { name: "Author 1" },
    },
    {
      id: "2",
      documentId: "doc-2",
      slug: "article-2",
      title: "Article 2",
      description: "Description 2",
      content: "Content 2",
      imageUrl: "/image2.jpg",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
      publishedAt: "2024-01-02T00:00:00.000Z",
      author: { name: "Author 2" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders articles in grid layout", async () => {
      mockGetArticles.mockResolvedValue({
        articles: mockArticles,
        error: null,
        pagination: { page: 1, pageSize: 3, pageCount: 1, total: 2 },
      });

      const component = await ArticlesPage();
      const { container } = render(component);

      // Check grid container
      expect(container.firstChild).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3", "gap-8");

      // Check articles are rendered
      expect(screen.getByTestId("article-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("article-card-2")).toBeInTheDocument();
      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
    });

    it("renders empty state when no articles", async () => {
      mockGetArticles.mockResolvedValue({
        articles: [],
        error: null,
        pagination: { page: 1, pageSize: 3, pageCount: 0, total: 0 },
      });

      const component = await ArticlesPage();
      const { container } = render(component);

      // Check empty state is rendered
      expect(screen.getByTestId("articles-empty-state")).toBeInTheDocument();
      expect(screen.getByText("No articles available")).toBeInTheDocument();
      expect(
        screen.getByText(
          "There are no articles to display at this time. Check back later for new content!"
        )
      ).toBeInTheDocument();

      // Check it has col-span-full class
      const emptyStateContainer = container.querySelector(".col-span-full");
      expect(emptyStateContainer).toBeInTheDocument();
    });

    it("renders single article correctly", async () => {
      const singleArticle = mockArticles[0]!;
      mockGetArticles.mockResolvedValue({
        articles: [singleArticle],
        error: null,
        pagination: { page: 1, pageSize: 3, pageCount: 1, total: 1 },
      });

      const component = await ArticlesPage();
      render(component);

      expect(screen.getByTestId("article-card-1")).toBeInTheDocument();
      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.queryByTestId("article-card-2")).not.toBeInTheDocument();
    });
  });

  describe("Service integration", () => {
    it("calls getArticles with correct parameters", async () => {
      mockGetArticles.mockResolvedValue({
        articles: mockArticles,
        error: null,
        pagination: { page: 1, pageSize: 3, pageCount: 1, total: 2 },
      });

      await ArticlesPage();

      expect(mockGetArticles).toHaveBeenCalledWith({
        searchParams: expect.any(URLSearchParams),
      });

      // Verify the URLSearchParams content
      const call = mockGetArticles.mock.calls[0];
      expect(call).toBeDefined();
      const searchParams = call?.[0]?.searchParams;
      expect(searchParams?.get("pagination[page]")).toBe("1");
      expect(searchParams?.get("pagination[pageSize]")).toBe("3");
      expect(searchParams?.get("populate")).toBe("*");
    });

    it("handles service errors by throwing", async () => {
      const error = new Error("Service error");
      mockGetArticles.mockRejectedValue(error);

      await expect(ArticlesPage()).rejects.toThrow("Service error");
    });
  });

  describe("Edge cases", () => {
    it("handles many articles", async () => {
      const manyArticles: Article[] = Array.from({ length: 5 }, (_, i) => ({
        ...mockArticles[0]!,
        id: `${i + 1}`,
        documentId: `doc-${i + 1}`,
        slug: `article-${i + 1}`,
        title: `Article ${i + 1}`,
        description: `Description ${i + 1}`,
      }));

      mockGetArticles.mockResolvedValue({
        articles: manyArticles,
        error: null,
        pagination: { page: 1, pageSize: 3, pageCount: 2, total: 5 },
      });

      const component = await ArticlesPage();
      render(component);

      // Should render all articles
      manyArticles.forEach((article) => {
        expect(screen.getByTestId(`article-card-${article.id}`)).toBeInTheDocument();
      });
    });
  });
});
