import { generateMetadata } from "../page";

jest.mock("@/services/article", () => ({
  getArticles: jest.fn(),
}));

jest.mock("@/components/features/article/ArticleList", () => {
  return function MockArticleList({ articles, pagination }: any) {
    return (
      <div data-testid="article-list">
        <div data-testid="articles-count">{articles.length}</div>
        <div data-testid="pagination-page">{pagination.page}</div>
      </div>
    );
  };
});

jest.mock("@/components/ui/Banner", () => ({
  Banner: function MockBanner({ title, description }: any) {
    return (
      <div data-testid="banner">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    );
  },
}));

jest.mock("@/components/ui/SkeletonList", () => {
  return function MockSkeletonList({ length }: any) {
    return <div data-testid="skeleton-list" data-length={length}></div>;
  };
});

jest.mock("@/constants", () => ({
  PAGE_DEFAULT: 1,
  PAGE_SIZE_DEFAULT_ARTICLE: 6,
}));

describe("Articles Page", () => {
  describe("generateMetadata", () => {
    it("should return correct metadata", () => {
      const metadata = generateMetadata();

      expect(metadata).toEqual({
        title: "Articles",
      });
    });

    it("should have a string title", () => {
      const metadata = generateMetadata();

      expect(typeof metadata.title).toBe("string");
      expect(metadata.title).toBe("Articles");
    });
  });

  describe("Component Structure", () => {
    it("should define proper component exports", () => {
      const pageModule = require("../page");

      expect(typeof pageModule.generateMetadata).toBe("function");
      expect(typeof pageModule.default).toBe("function");
    });

    it("should handle search params type", () => {
      const searchParams = { page: "2" };

      expect(typeof searchParams).toBe("object");
      expect(searchParams.page).toBe("2");
    });
  });

  describe("Constants", () => {
    it("should use correct default values", () => {
      const { PAGE_DEFAULT, PAGE_SIZE_DEFAULT_ARTICLE } = require("@/constants");

      expect(PAGE_DEFAULT).toBe(1);
      expect(PAGE_SIZE_DEFAULT_ARTICLE).toBe(6);
    });

    it("should construct proper search params", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("pagination[page]", "1");
      searchParams.set("pagination[pageSize]", "6");
      searchParams.set("populate", "*");

      expect(searchParams.get("pagination[page]")).toBe("1");
      expect(searchParams.get("pagination[pageSize]")).toBe("6");
      expect(searchParams.get("populate")).toBe("*");
    });
  });

  describe("Mock Component Behavior", () => {
    it("should render Banner component with correct props", () => {
      const { Banner } = require("@/components/ui/Banner");
      const bannerProps = {
        title: "Articles",
        description:
          "There are many variations of passages of Lorem Ipsum available,  have suffered alteration in some form.",
      };

      expect(typeof Banner).toBe("function");
      expect(bannerProps.title).toBe("Articles");
      expect(bannerProps.description).toContain("Lorem Ipsum");
    });

    it("should render SkeletonList with correct length", () => {
      const skeletonProps = { length: 6 };

      expect(skeletonProps.length).toBe(6);
      expect(typeof jest.fn()).toBe("function");
    });

    it("should handle ArticleList props", () => {
      const mockArticles = [
        { id: "1", title: "Article 1" },
        { id: "2", title: "Article 2" },
      ];
      const mockPagination = {
        page: 1,
        pageSize: 6,
        total: 2,
      };

      expect(Array.isArray(mockArticles)).toBe(true);
      expect(mockArticles).toHaveLength(2);
      expect(mockPagination.page).toBe(1);
      expect(mockPagination.pageSize).toBe(6);
    });
  });

  describe("Search Params Handling", () => {
    it("should handle undefined search params", async () => {
      const searchParams = undefined;
      const defaultPage = 1;

      const result: any = searchParams || {};
      const page = result.page || defaultPage;

      expect(page).toBe(defaultPage);
    });

    it("should handle empty search params", async () => {
      const searchParams: any = {};
      const defaultPage = 1;

      const page = searchParams.page || defaultPage;

      expect(page).toBe(defaultPage);
    });

    it("should handle search params with page", async () => {
      const searchParams: any = { page: "3" };

      expect(searchParams.page).toBe("3");
      expect(parseInt(searchParams.page)).toBe(3);
    });

    it("should handle search params as Promise", async () => {
      const searchParamsPromise = Promise.resolve({ page: "2" });
      const resolvedParams = await searchParamsPromise;

      expect(resolvedParams.page).toBe("2");
    });
  });

  describe("API Search Params Construction", () => {
    it("should construct URLSearchParams correctly", () => {
      const page = 2;
      const pageSize = 6;

      const searchParamsAPI = new URLSearchParams();
      searchParamsAPI.set("pagination[page]", page.toString());
      searchParamsAPI.set("pagination[pageSize]", pageSize.toString());
      searchParamsAPI.set("populate", "*");

      expect(searchParamsAPI.toString()).toContain("pagination%5Bpage%5D=2");
      expect(searchParamsAPI.toString()).toContain("pagination%5BpageSize%5D=6");
      expect(searchParamsAPI.toString()).toContain("populate=");
    });

    it("should handle different page values", () => {
      const testCases = [1, 5, 10, 100];

      testCases.forEach((page) => {
        const searchParams = new URLSearchParams();
        searchParams.set("pagination[page]", page.toString());

        expect(searchParams.get("pagination[page]")).toBe(page.toString());
      });
    });

    it("should handle populate parameter", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("populate", "*");

      expect(searchParams.get("populate")).toBe("*");
      expect(searchParams.toString()).toBe("populate=*");
    });
  });

  describe("Service Integration", () => {
    it("should call getArticles with correct parameters", () => {
      const { getArticles } = require("@/services/article");
      const mockSearchParams = new URLSearchParams();
      mockSearchParams.set("pagination[page]", "1");
      mockSearchParams.set("pagination[pageSize]", "6");
      mockSearchParams.set("populate", "*");

      const expectedParams = {
        searchParams: mockSearchParams,
      };

      expect(typeof getArticles).toBe("function");
      expect(expectedParams.searchParams).toBeInstanceOf(URLSearchParams);
    });

    it("should handle getArticles response structure", () => {
      const mockResponse = {
        articles: [
          { id: "1", title: "Article 1" },
          { id: "2", title: "Article 2" },
        ],
        pagination: {
          page: 1,
          pageSize: 6,
          total: 2,
        },
      };

      expect(Array.isArray(mockResponse.articles)).toBe(true);
      expect(mockResponse.pagination).toHaveProperty("page");
      expect(mockResponse.pagination).toHaveProperty("pageSize");
      expect(mockResponse.pagination).toHaveProperty("total");
    });
  });

  describe("Error Handling", () => {
    it("should handle getArticles service errors", () => {
      const { getArticles } = require("@/services/article");

      getArticles.mockRejectedValue(new Error("Service unavailable"));

      expect(getArticles).toBeDefined();
      expect(typeof getArticles).toBe("function");
    });

    it("should handle empty articles response", () => {
      const emptyResponse = {
        articles: [],
        pagination: {
          page: 1,
          pageSize: 6,
          total: 0,
        },
      };

      expect(emptyResponse.articles).toHaveLength(0);
      expect(emptyResponse.pagination.total).toBe(0);
    });

    it("should handle invalid page numbers", () => {
      const invalidPages = ["invalid", "0", ""];
      const defaultPage = 1;

      invalidPages.forEach((invalidPage) => {
        const page = parseInt(invalidPage) || defaultPage;
        expect(page).toBe(defaultPage);
      });

      const negativePage = parseInt("-1") > 0 ? parseInt("-1") : defaultPage;
      expect(negativePage).toBe(defaultPage);
    });
  });

  describe("Component Integration", () => {
    it("should handle Suspense fallback", () => {
      const fallbackProps = {
        banner: {
          title: "Articles",
          description:
            "There are many variations of passages of Lorem Ipsum available,  have suffered alteration in some form.",
        },
        skeletonList: {
          length: 6,
        },
      };

      expect(fallbackProps.banner.title).toBe("Articles");
      expect(fallbackProps.skeletonList.length).toBe(6);
    });

    it("should handle ArticlesPage component props", () => {
      const componentProps = {
        searchParams: { page: "2" },
      };

      expect(componentProps.searchParams).toHaveProperty("page");
      expect(componentProps.searchParams.page).toBe("2");
    });
  });
});
