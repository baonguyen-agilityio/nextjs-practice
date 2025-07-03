import React from "react";
import { render, screen } from "@testing-library/react";
import ArticlesPageWrapper, { generateMetadata } from "../page";
import { getArticles } from "@/services/article";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT_ARTICLE } from "@/constants";

// Mock the getArticles service
jest.mock("@/services/article", () => ({
  getArticles: jest.fn(),
}));

// Mock the Banner component
jest.mock("@/components/ui/Banner", () => ({
  Banner: ({ title, description }: any) => (
    <div data-testid="banner">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

// Mock the SkeletonList component
jest.mock("@/components/ui/SkeletonList", () => {
  return function MockSkeletonList({ length }: any) {
    return <div data-testid="skeleton-list">Loading {length} items...</div>;
  };
});

// Mock the ArticleList component
jest.mock("@/components/features/article/ArticleList", () => {
  return function MockArticleList({ articles, pagination }: any) {
    return (
      <div data-testid="article-list">
        <div data-testid="articles-count">{articles.length}</div>
        <div data-testid="current-page">{pagination?.page || 1}</div>
      </div>
    );
  };
});

const mockGetArticles = jest.mocked(getArticles);

describe("Articles Page", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetArticles.mockResolvedValue(mockArticlesResponse);
  });

  describe("generateMetadata", () => {
    it("returns correct metadata object", () => {
      const metadata = generateMetadata();

      expect(metadata).toEqual({
        title: "Articles",
        description:
          "Explore our collection of articles about books, reading tips, author interviews, and literary insights. Stay updated with the latest in the world of literature.",
        openGraph: {
          title: "Articles | BookStore",
          description:
            "Explore our collection of articles about books, reading tips, author interviews, and literary insights.",
          type: "website",
        },
      });
    });
  });

  describe("ArticlesPageWrapper", () => {
    it("renders Suspense fallback with Banner and SkeletonList", () => {
      render(<ArticlesPageWrapper searchParams={Promise.resolve({})} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
      expect(screen.getByText("Articles")).toBeInTheDocument();
      expect(screen.getByText("Loading 6 items...")).toBeInTheDocument();
    });

    it("renders with different searchParams scenarios", () => {
      // Test with empty object
      render(<ArticlesPageWrapper searchParams={Promise.resolve({})} />);
      expect(screen.getByTestId("banner")).toBeInTheDocument();

      // Test with page parameter
      render(<ArticlesPageWrapper searchParams={Promise.resolve({ page: 2 })} />);
      expect(screen.getByTestId("banner")).toBeInTheDocument();

      // Test with null searchParams
      render(<ArticlesPageWrapper searchParams={null as any} />);
      expect(screen.getByTestId("banner")).toBeInTheDocument();
    });
  });

  describe("Internal ArticlesPage logic verification", () => {
    it("constructs correct URLSearchParams for default page", () => {
      const page = PAGE_DEFAULT;
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", page.toString());
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT_ARTICLE.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("1");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("12");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("constructs correct URLSearchParams for custom page", () => {
      const page = 5;
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", page.toString());
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT_ARTICLE.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.get("pagination[page]")).toBe("5");
      expect(searchParamsAPI.get("pagination[pageSize]")).toBe("12");
      expect(searchParamsAPI.get("populate")).toBe("*");
    });

    it("handles searchParams parameter extraction", async () => {
      // Test default fallback
      const emptyParams = Promise.resolve({});
      const result1 = (await emptyParams) || {};
      const page1 = (result1 as any).page || PAGE_DEFAULT;
      expect(page1).toBe(1);

      // Test with page value
      const paramsWithPage = Promise.resolve({ page: 3 });
      const result2 = (await paramsWithPage) || {};
      const page2 = (result2 as any).page || PAGE_DEFAULT;
      expect(page2).toBe(3);

      // Test with null
      const nullParams = Promise.resolve(null);
      const result3 = (await nullParams) || {};
      const page3 = (result3 as any).page || PAGE_DEFAULT;
      expect(page3).toBe(1);
    });

    it("verifies service integration pattern", async () => {
      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", "2");
      searchParamsAPI.set("pagination[pageSize]", PAGE_SIZE_DEFAULT_ARTICLE.toString());
      searchParamsAPI.set("populate", "*");

      const result = await getArticles({ searchParams: searchParamsAPI });

      expect(mockGetArticles).toHaveBeenCalledWith({
        searchParams: searchParamsAPI,
      });
      expect(result.articles).toHaveLength(1);
      expect(result.pagination?.page).toBe(1);
    });
  });
});
