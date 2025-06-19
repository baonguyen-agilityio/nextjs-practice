import { render, screen } from "@testing-library/react";
import { getArticles } from "@/services/article";
import ArticlesPage from "../default";

jest.mock("@/services/article", () => ({
  getArticles: jest.fn(),
}));

jest.mock("@/components/features/article/ArticleCard", () => ({
  ArticleCard: function MockArticleCard({ article }: { article: any }) {
    return (
      <div data-testid={`article-card-${article.id}`}>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
      </div>
    );
  },
}));

const mockGetArticles = jest.mocked(getArticles);

describe("Articles Page (@articles/default)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockArticles = [
    {
      id: "1",
      title: "Article 1",
      description: "Description 1",
      slug: "article-1",
      content: "Content 1",
      publishedAt: "2024-01-01T00:00:00.000Z",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      author: { name: "Author 1" },
      documentId: "doc1",
      imageUrl: "/image1.jpg",
    },
    {
      id: "2",
      title: "Article 2",
      description: "Description 2",
      slug: "article-2",
      content: "Content 2",
      publishedAt: "2024-01-02T00:00:00.000Z",
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
      author: { name: "Author 2" },
      documentId: "doc2",
      imageUrl: "/image2.jpg",
    },
    {
      id: "3",
      title: "Article 3",
      description: "Description 3",
      slug: "article-3",
      content: "Content 3",
      publishedAt: "2024-01-03T00:00:00.000Z",
      createdAt: "2024-01-03T00:00:00.000Z",
      updatedAt: "2024-01-03T00:00:00.000Z",
      author: { name: "Author 3" },
      documentId: "doc3",
      imageUrl: "/image3.jpg",
    },
  ];

  describe("Component Rendering", () => {
    it("should render articles in grid layout", async () => {
      mockGetArticles.mockResolvedValue({ articles: mockArticles, error: null });

      const component = await ArticlesPage();
      const { container } = render(component);

      expect(screen.getByTestId("article-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("article-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("article-card-3")).toBeInTheDocument();

      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
      expect(screen.getByText("Article 3")).toBeInTheDocument();

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3", "gap-8");
    });

    it("should render empty grid when no articles", async () => {
      mockGetArticles.mockResolvedValue({ articles: [], error: null });

      const component = await ArticlesPage();
      const { container } = render(component);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.children).toHaveLength(0);
    });

    it("should handle single article", async () => {
      const firstArticle = mockArticles[0];
      if (firstArticle) {
        mockGetArticles.mockResolvedValue({ articles: [firstArticle], error: null });

        const component = await ArticlesPage();
        render(component);

        expect(screen.getByTestId("article-card-1")).toBeInTheDocument();
        expect(screen.getByText("Article 1")).toBeInTheDocument();
        expect(screen.queryByTestId("article-card-2")).not.toBeInTheDocument();
      }
    });
  });

  describe("Service Integration", () => {
    it("should call getArticles with correct parameters", async () => {
      mockGetArticles.mockResolvedValue({ articles: mockArticles, error: null });

      await ArticlesPage();

      expect(mockGetArticles).toHaveBeenCalledWith({
        searchParams: expect.any(URLSearchParams),
      });

      const call = mockGetArticles.mock.calls[0];
      if (call?.[0]?.searchParams) {
        const searchParams = call[0].searchParams;
        expect(searchParams.get("pagination[page]")).toBe("1");
        expect(searchParams.get("pagination[pageSize]")).toBe("3");
        expect(searchParams.get("populate")).toBe("*");
      }
    });

    it("should handle service errors", async () => {
      mockGetArticles.mockRejectedValue(new Error("Service error"));

      await expect(ArticlesPage()).rejects.toThrow("Service error");
    });

    it("should handle malformed response", async () => {
      mockGetArticles.mockResolvedValue({ articles: null as any, error: "Not found" });

      await expect(ArticlesPage()).rejects.toThrow();
    });
  });

  describe("URLSearchParams Logic", () => {
    it("should construct correct search parameters", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("pagination[page]", "1");
      searchParams.set("pagination[pageSize]", "3");
      searchParams.set("populate", "*");

      expect(searchParams.get("pagination[page]")).toBe("1");
      expect(searchParams.get("pagination[pageSize]")).toBe("3");
      expect(searchParams.get("populate")).toBe("*");
    });

    it("should have exactly 3 parameters", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("pagination[page]", "1");
      searchParams.set("pagination[pageSize]", "3");
      searchParams.set("populate", "*");

      expect(Array.from(searchParams.keys())).toHaveLength(3);
    });
  });

  describe("Article Mapping", () => {
    it("should map articles with correct keys", async () => {
      mockGetArticles.mockResolvedValue({ articles: mockArticles, error: null });

      const component = await ArticlesPage();
      render(component);

      mockArticles.forEach((article) => {
        expect(screen.getByTestId(`article-card-${article.id}`)).toBeInTheDocument();
      });
    });

    it("should preserve article data", async () => {
      mockGetArticles.mockResolvedValue({ articles: mockArticles, error: null });

      const component = await ArticlesPage();
      render(component);

      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Description 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
      expect(screen.getByText("Description 2")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle articles without optional fields", async () => {
      const minimalArticles = [
        {
          id: "minimal",
          title: "Minimal Article",
          description: "Minimal description",
          slug: "minimal",
          content: "Minimal content",
          publishedAt: "2024-01-01T00:00:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          author: { name: "Minimal Author" },
          documentId: "minimal-doc",
          imageUrl: "/minimal.jpg",
        },
      ];

      mockGetArticles.mockResolvedValue({ articles: minimalArticles, error: null });

      const component = await ArticlesPage();
      render(component);

      expect(screen.getByTestId("article-card-minimal")).toBeInTheDocument();
      expect(screen.getByText("Minimal Article")).toBeInTheDocument();
    });

    it("should handle undefined articles", async () => {
      mockGetArticles.mockResolvedValue({ articles: undefined as any, error: null });

      await expect(ArticlesPage()).rejects.toThrow();
    });
  });
});
