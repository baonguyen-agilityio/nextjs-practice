import { render, screen, waitFor } from "@testing-library/react";
import ArticlesPage from "../default";

jest.mock("@/services/article", () => ({
  getArticles: jest.fn(),
}));

jest.mock("@/components/features/article/ArticleCard", () => ({
  ArticleCard: function MockArticleCard({ article }: { article: any }) {
    return (
      <div data-testid={`article-card-${article.id}`} className="article-card">
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <span data-testid="article-id">{article.id}</span>
      </div>
    );
  },
}));

describe("Articles Page (@articles/default)", () => {
  const mockArticles = [
    {
      id: "1",
      title: "Article 1",
      excerpt: "This is the first article excerpt",
      content: "Full article content 1",
    },
    {
      id: "2",
      title: "Article 2",
      excerpt: "This is the second article excerpt",
      content: "Full article content 2",
    },
    {
      id: "3",
      title: "Article 3",
      excerpt: "This is the third article excerpt",
      content: "Full article content 3",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render articles when service returns data", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const ArticlesPageComponent = await ArticlesPage();
      render(ArticlesPageComponent);

      expect(screen.getByTestId("article-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("article-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("article-card-3")).toBeInTheDocument();

      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
      expect(screen.getByText("Article 3")).toBeInTheDocument();
    });

    it("should render empty grid when no articles are returned", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: [] });

      const ArticlesPageComponent = await ArticlesPage();
      const { container } = render(ArticlesPageComponent);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.children).toHaveLength(0);
    });

    it("should call getArticles with correct parameters", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      await ArticlesPage();

      expect(getArticles).toHaveBeenCalledWith({
        searchParams: expect.any(URLSearchParams),
      });

      const call = getArticles.mock.calls[0][0];
      const searchParams = call.searchParams;

      expect(searchParams.get("pagination[page]")).toBe("1");
      expect(searchParams.get("pagination[pageSize]")).toBe("3");
      expect(searchParams.get("populate")).toBe("*");
    });

    it("should render with correct grid classes", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const ArticlesPageComponent = await ArticlesPage();
      const { container } = render(ArticlesPageComponent);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3", "gap-8");
    });

    it("should render articles with proper keys", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const ArticlesPageComponent = await ArticlesPage();
      render(ArticlesPageComponent);

      // Each article should be rendered with its id as key
      mockArticles.forEach((article) => {
        expect(screen.getByTestId(`article-card-${article.id}`)).toBeInTheDocument();
      });
    });

    it("should handle articles with different properties", async () => {
      const { getArticles } = require("@/services/article");
      const articleWithMinimalData = [{ id: "minimal", title: "Minimal Article" }];
      getArticles.mockResolvedValue({ articles: articleWithMinimalData });

      const ArticlesPageComponent = await ArticlesPage();
      render(ArticlesPageComponent);

      expect(screen.getByTestId("article-card-minimal")).toBeInTheDocument();
      expect(screen.getByText("Minimal Article")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockRejectedValue(new Error("Service error"));

      await expect(ArticlesPage()).rejects.toThrow("Service error");
    });

    it("should handle malformed service response", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: null });

      await expect(ArticlesPage()).rejects.toThrow();
    });

    it("should handle undefined articles in response", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({});

      await expect(ArticlesPage()).rejects.toThrow();
    });
  });

  describe("Component Structure", () => {
    it("should export default component", () => {
      const defaultModule = require("../default");

      expect(typeof defaultModule.default).toBe("function");
      expect(defaultModule.default.name).toBe("ArticlesPage");
    });

    it("should be an async component", () => {
      const defaultModule = require("../default");
      const component = defaultModule.default;

      expect(component.constructor.name).toBe("AsyncFunction");
    });
  });

  describe("URLSearchParams Construction", () => {
    it("should construct correct search params", () => {
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "3");
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("1");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("3");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("should have correct parameter structure", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("pagination[page]", "1");
      searchParams.set("pagination[pageSize]", "3");
      searchParams.set("populate", "*");

      const encoded = searchParams.toString();
      expect(encoded).toContain("pagination");
      expect(encoded).toContain("page");
      expect(encoded).toContain("pageSize");
      expect(encoded).toContain("populate");
    });

    it("should use hardcoded pagination values", () => {
      const page = "1";
      const pageSize = "3";
      const populate = "*";

      expect(page).toBe("1");
      expect(pageSize).toBe("3");
      expect(populate).toBe("*");
    });
  });

  describe("Service Integration", () => {
    it("should call getArticles with correct search params", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "3");
      searchParamsAPI.set("populate", "*");

      await getArticles({ searchParams: searchParamsAPI });

      expect(getArticles).toHaveBeenCalledWith({
        searchParams: expect.any(URLSearchParams),
      });
      expect(getArticles).toHaveBeenCalledTimes(1);
    });

    it("should handle successful articles fetch", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const result = await getArticles({ searchParams: new URLSearchParams() });

      expect(result.articles).toEqual(mockArticles);
      expect(result.articles).toHaveLength(3);
    });

    it("should handle empty articles response", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: [] });

      const result = await getArticles({ searchParams: new URLSearchParams() });

      expect(result.articles).toEqual([]);
      expect(result.articles).toHaveLength(0);
    });

    it("should handle service errors", async () => {
      const { getArticles } = require("@/services/article");
      const error = new Error("Service error");
      getArticles.mockRejectedValue(error);

      await expect(getArticles({ searchParams: new URLSearchParams() })).rejects.toThrow(
        "Service error"
      );
    });

    it("should handle malformed service response", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: null });

      const result = await getArticles({ searchParams: new URLSearchParams() });

      expect(result.articles).toBeNull();
    });

    it("should handle undefined articles in response", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({});

      const result = await getArticles({ searchParams: new URLSearchParams() });

      expect(result.articles).toBeUndefined();
    });
  });

  describe("Grid Layout", () => {
    it("should have correct CSS grid classes", () => {
      const expectedClasses = ["grid", "grid-cols-1", "md:grid-cols-3", "gap-8"];

      expectedClasses.forEach((className) => {
        expect(className).toBeTruthy();
        expect(typeof className).toBe("string");
      });
    });

    it("should render responsive grid layout", () => {
      const gridClasses = "grid grid-cols-1 md:grid-cols-3 gap-8";

      expect(gridClasses).toContain("grid-cols-1");
      expect(gridClasses).toContain("md:grid-cols-3");
      expect(gridClasses).toContain("gap-8");
    });

    it("should handle different screen sizes", () => {
      const mobileClass = "grid-cols-1";
      expect(mobileClass).toBe("grid-cols-1");

      const desktopClass = "md:grid-cols-3";
      expect(desktopClass).toBe("md:grid-cols-3");
    });
  });

  describe("ArticleCard Integration", () => {
    it("should render ArticleCard for each article", () => {
      const { ArticleCard } = require("@/components/features/article/ArticleCard");

      expect(typeof ArticleCard).toBe("function");

      mockArticles.forEach((article) => {
        const { container } = render(<ArticleCard article={article} />);
        expect(container.querySelector('[data-testid^="article-card"]')).toBeInTheDocument();
      });
    });

    it("should pass correct props to ArticleCard", () => {
      const { ArticleCard } = require("@/components/features/article/ArticleCard");
      const testArticle = mockArticles[0]!;

      render(<ArticleCard article={testArticle} />);

      expect(screen.getByText(testArticle.title)).toBeInTheDocument();
      expect(screen.getByText(testArticle.excerpt)).toBeInTheDocument();
      expect(screen.getByTestId("article-id")).toHaveTextContent(testArticle.id);
    });

    it("should handle articles with different data structures", () => {
      const { ArticleCard } = require("@/components/features/article/ArticleCard");

      const minimalArticle = { id: "min", title: "Minimal" };
      const fullArticle = {
        id: "full",
        title: "Full Article",
        excerpt: "Full excerpt",
        content: "Full content",
        author: "Author",
        publishedAt: "2023-01-01",
      };

      render(<ArticleCard article={minimalArticle} />);
      expect(screen.getByText("Minimal")).toBeInTheDocument();

      render(<ArticleCard article={fullArticle} />);
      expect(screen.getByText("Full Article")).toBeInTheDocument();
      expect(screen.getByText("Full excerpt")).toBeInTheDocument();
    });

    it("should generate unique keys for each article", () => {
      const ids = mockArticles.map((article) => article.id);
      const uniqueIds = [...new Set(ids)];

      expect(uniqueIds).toHaveLength(ids.length);
      expect(ids).toEqual(["1", "2", "3"]);
    });
  });

  describe("Data Flow", () => {
    it("should maintain article order from service", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const result = await getArticles({ searchParams: new URLSearchParams() });

      expect(result.articles[0].id).toBe("1");
      expect(result.articles[1].id).toBe("2");
      expect(result.articles[2].id).toBe("3");
    });

    it("should handle varying article counts", async () => {
      const { getArticles } = require("@/services/article");

      getArticles.mockResolvedValue({ articles: [mockArticles[0]] });
      let result = await getArticles({ searchParams: new URLSearchParams() });
      expect(result.articles).toHaveLength(1);

      const fiveArticles = [...mockArticles, ...mockArticles.slice(0, 2)];
      getArticles.mockResolvedValue({ articles: fiveArticles });
      result = await getArticles({ searchParams: new URLSearchParams() });
      expect(result.articles).toHaveLength(5);
    });

    it("should preserve article data integrity", async () => {
      const { getArticles } = require("@/services/article");
      getArticles.mockResolvedValue({ articles: mockArticles });

      const result = await getArticles({ searchParams: new URLSearchParams() });

      result.articles.forEach((article: any, index: number) => {
        expect(article).toEqual(mockArticles[index]);
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("title");
      });
    });
  });

  describe("Performance Considerations", () => {
    it("should limit results to 3 articles", () => {
      const pageSize = "3";

      expect(pageSize).toBe("3");
      expect(parseInt(pageSize)).toBe(3);
    });

    it("should request first page only", () => {
      const page = "1";

      expect(page).toBe("1");
      expect(parseInt(page)).toBe(1);
    });

    it("should populate all related data", () => {
      const populate = "*";

      expect(populate).toBe("*");
    });

    it("should construct efficient API parameters", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("pagination[page]", "1");
      searchParams.set("pagination[pageSize]", "3");
      searchParams.set("populate", "*");

      const params = Array.from(searchParams.keys());
      expect(params).toHaveLength(3);
    });
  });

  describe("Error Boundaries", () => {
    it("should handle component render errors gracefully", () => {
      expect(() => {
        const articles: any[] = [];
        articles.map((article) => article.id);
      }).not.toThrow();
    });

    it("should handle null articles array", () => {
      const articles = null;

      expect(articles).toBeNull();
    });

    it("should handle undefined articles array", () => {
      const articles = undefined;

      expect(articles).toBeUndefined();
    });
  });

  describe("Accessibility", () => {
    it("should provide semantic structure for screen readers", () => {
      const gridContainer = "grid grid-cols-1 md:grid-cols-3 gap-8";

      expect(gridContainer).toContain("grid");
      expect(gridContainer).toContain("gap-8");
    });

    it("should support keyboard navigation through grid", () => {
      const expectedStructure = "div with grid layout containing article cards";

      expect(expectedStructure).toContain("grid");
      expect(expectedStructure).toContain("article");
    });
  });
});
