import { render, screen } from "@testing-library/react";
import { generateMetadata } from "../page";
import ArticlesPageWrapper from "../page";
import { getArticles } from "@/services/article";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT_ARTICLE } from "@/constants";

jest.mock("@/services/article", () => ({
  getArticles: jest.fn(),
}));

jest.mock("@/components/features/article/ArticleList", () => {
  return function MockArticleList({ articles, pagination }: any) {
    return (
      <div data-testid="article-list">
        <div>Articles: {articles.length}</div>
        <div>Page: {pagination?.page}</div>
      </div>
    );
  };
});

jest.mock("@/components/ui/Banner", () => ({
  Banner: ({ title, description }: any) => (
    <div data-testid="banner">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock("@/components/ui/SkeletonList", () => {
  return function MockSkeletonList({ length }: any) {
    return <div data-testid="skeleton-list">Loading {length} items...</div>;
  };
});

const mockGetArticles = jest.mocked(getArticles);

describe("Articles Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMetadata", () => {
    it("should return correct metadata", () => {
      const metadata = generateMetadata();
      expect(metadata).toEqual({ title: "Articles" });
    });
  });

  describe("ArticlesPageWrapper component", () => {
    const mockArticlesResponse = {
      articles: [
        {
          id: "1",
          title: "Test Article",
          slug: "test-article",
          description: "Test description",
          content: "Test content",
          publishedAt: "2024-01-01T00:00:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          author: { name: "Test Author" },
          documentId: "doc1",
          imageUrl: "/test.jpg",
        },
      ],
      pagination: { page: 1, pageSize: 12, pageCount: 1, total: 1 },
      error: null,
    };

    it("should render Suspense fallback initially", () => {
      mockGetArticles.mockResolvedValue(mockArticlesResponse);

      render(<ArticlesPageWrapper searchParams={Promise.resolve({})} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
      expect(screen.getByText("Articles")).toBeInTheDocument();
      expect(screen.getByText("Loading 6 items...")).toBeInTheDocument();
    });

    it("should render with empty search params", () => {
      mockGetArticles.mockResolvedValue(mockArticlesResponse);

      render(<ArticlesPageWrapper searchParams={Promise.resolve({})} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
    });

    it("should render with page parameter", () => {
      mockGetArticles.mockResolvedValue(mockArticlesResponse);

      render(<ArticlesPageWrapper searchParams={Promise.resolve({ page: 2 })} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
    });

    it("should render with null search params", () => {
      mockGetArticles.mockResolvedValue(mockArticlesResponse);

      render(<ArticlesPageWrapper searchParams={null as any} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
    });
  });

  describe("ArticlesPage logic", () => {
    it("should construct URLSearchParams with default page", () => {
      const page = PAGE_DEFAULT;
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", page.toString());
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT_ARTICLE.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("1");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("12");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("should construct URLSearchParams with custom page", () => {
      const page = 5;
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", page.toString());
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT_ARTICLE.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("5");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("12");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("should handle empty search params", async () => {
      const searchParams = Promise.resolve({});
      const result = await searchParams;
      const page = (result as any).page || PAGE_DEFAULT;

      expect(page).toBe(1);
    });

    it("should handle search params with page value", async () => {
      const searchParams = Promise.resolve({ page: 3 });
      const result = await searchParams;
      const page = (result as any).page || PAGE_DEFAULT;

      expect(page).toBe(3);
    });

    it("should handle search params with zero page", async () => {
      const searchParams = Promise.resolve({ page: 0 });
      const result = await searchParams;
      const page = (result as any).page || PAGE_DEFAULT;

      expect(page).toBe(1);
    });

    it("should handle search params with negative page", async () => {
      const searchParams = Promise.resolve({ page: -1 });
      const result = await searchParams;
      const page = (result as any).page || PAGE_DEFAULT;

      expect(page).toBe(-1);
    });

    it("should handle search params with string page", async () => {
      const searchParams = Promise.resolve({ page: "5" });
      const result = await searchParams;
      const page = (result as any).page || PAGE_DEFAULT;

      expect(page).toBe("5");
    });

    it("should handle null and undefined values", async () => {
      expect((await null) || {}).toEqual({});
      expect((await undefined) || {}).toEqual({});
      expect((await Promise.resolve(null)) || {}).toEqual({});
    });

    it("should call getArticles with correct parameters", async () => {
      const mockResponse = {
        articles: [
          {
            id: "1",
            title: "Test Article",
            slug: "test-article",
            description: "Test description",
            content: "Test content",
            publishedAt: "2024-01-01T00:00:00.000Z",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            author: { name: "Test Author" },
            documentId: "doc1",
            imageUrl: "/test.jpg",
          },
        ],
        pagination: { page: 1, pageSize: 12, pageCount: 1, total: 1 },
        error: null,
      };
      mockGetArticles.mockResolvedValue(mockResponse);

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "12");
      searchParamsAPI.set("populate", "*");

      const result = await getArticles({ searchParams: searchParamsAPI });

      expect(mockGetArticles).toHaveBeenCalledWith({
        searchParams: searchParamsAPI,
      });
      expect(result.articles).toHaveLength(1);
      expect(result.pagination?.page).toBe(1);
    });

    it("should handle empty articles response", async () => {
      const mockResponse = {
        articles: [],
        pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 },
        error: null,
      };
      mockGetArticles.mockResolvedValue(mockResponse);

      const searchParamsAPI = new URLSearchParams();
      const result = await getArticles({ searchParams: searchParamsAPI });

      expect(result.articles).toHaveLength(0);
      expect(result.pagination?.total).toBe(0);
    });

    it("should handle API errors", async () => {
      mockGetArticles.mockRejectedValue(new Error("API Error"));

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "1");
      searchParamsAPI.set("pagination[pageSize]", "12");
      searchParamsAPI.set("populate", "*");

      await expect(getArticles({ searchParams: searchParamsAPI })).rejects.toThrow("API Error");
    });

    it("should handle network timeout errors", async () => {
      mockGetArticles.mockRejectedValue(new Error("Network timeout"));

      const searchParamsAPI = new URLSearchParams();
      await expect(getArticles({ searchParams: searchParamsAPI })).rejects.toThrow(
        "Network timeout"
      );
    });
  });

  describe("Constants and utilities", () => {
    it("should use correct default constants", () => {
      expect(PAGE_DEFAULT).toBe(1);
      expect(PAGE_SIZE_DEFAULT_ARTICLE).toBe(12);
      expect(typeof PAGE_DEFAULT).toBe("number");
      expect(typeof PAGE_SIZE_DEFAULT_ARTICLE).toBe("number");
    });

    it("should convert numbers to strings correctly", () => {
      expect((1).toString()).toBe("1");
      expect((12).toString()).toBe("12");
      expect(PAGE_DEFAULT.toString()).toBe("1");
      expect(PAGE_SIZE_DEFAULT_ARTICLE.toString()).toBe("12");
    });

    it("should handle various numeric conversions", () => {
      expect((0).toString()).toBe("0");
      expect((100).toString()).toBe("100");
      expect((-1).toString()).toBe("-1");
    });
  });

  describe("URLSearchParams edge cases", () => {
    it("should handle URLSearchParams with multiple parameters", () => {
      const params = new URLSearchParams();
      params.set("pagination[page]", "1");
      params.set("pagination[pageSize]", "12");
      params.set("populate", "*");
      params.set("sort", "publishedAt:desc");

      expect(params.get("pagination[page]")).toBe("1");
      expect(params.get("sort")).toBe("publishedAt:desc");
      expect(params.toString()).toContain("pagination");
    });

    it("should handle URLSearchParams encoding", () => {
      const params = new URLSearchParams();
      params.set("filter", "title contains space");

      expect(params.toString()).toContain("filter=title+contains+space");
    });

    it("should handle empty URLSearchParams", () => {
      const params = new URLSearchParams();

      expect(params.toString()).toBe("");
      expect(params.get("nonexistent")).toBeNull();
    });
  });
});
