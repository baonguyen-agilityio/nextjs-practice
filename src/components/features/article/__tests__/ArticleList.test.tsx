import { render, screen } from "@testing-library/react";
import ArticleList from "../ArticleList";
import type { Article, MetaResponse } from "@/types";

const mockReplace = jest.fn();
const mockStartTransition = jest.fn((callback) => callback());

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/articles"),
  useRouter: jest.fn(() => ({
    replace: mockReplace,
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useTransition: jest.fn(() => [false, mockStartTransition]),
}));

jest.mock("@/components/features/article/ArticleCard", () => ({
  ArticleCard: function MockArticleCard({ article }: { article: Article }) {
    return <div data-testid="article-card">{article.title}</div>;
  },
}));

jest.mock("@/components/ui/Banner", () => ({
  Banner: function MockBanner({ title, description }: any) {
    return (
      <div data-testid="banner">
        {title} - {description}
      </div>
    );
  },
}));

jest.mock("@/components/ui/SkeletonList", () => {
  return function MockSkeletonList({ length }: { length: number }) {
    return <div data-testid="skeleton-list">Loading {length} items...</div>;
  };
});

jest.mock("@/components/ui/Pagination", () => {
  return function MockPagination({ total, initialPage, onChange }: any) {
    return (
      <div
        data-testid="pagination"
        data-total={total}
        data-initial-page={initialPage}
        onClick={() => onChange && onChange(2)}
      >
        Pagination {total} pages
      </div>
    );
  };
});

jest.mock("@/constants", () => ({
  PAGE_DEFAULT: 1,
}));

describe("ArticleList", () => {
  const mockArticles: Article[] = [
    {
      id: "1",
      documentId: "doc-1",
      slug: "article-1",
      title: "Article 1",
      description: "Description 1",
      content: "Content 1",
      imageUrl: "/image1.jpg",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      publishedAt: "2023-01-01T00:00:00.000Z",
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
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
      publishedAt: "2023-01-02T00:00:00.000Z",
      author: { name: "Author 2" },
    },
  ];

  const mockPagination: MetaResponse["pagination"] = {
    page: 1,
    pageSize: 10,
    pageCount: 3,
    total: 25,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render banner with correct title and description", () => {
      render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

      const banner = screen.getByTestId("banner");
      expect(banner).toHaveTextContent("Articles - There are many variations of passages");
    });

    it("should render articles", () => {
      render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

      expect(screen.getByText("Article 1")).toBeInTheDocument();
      expect(screen.getByText("Article 2")).toBeInTheDocument();
      expect(screen.getAllByTestId("article-card")).toHaveLength(2);
    });

    it("should handle empty articles array", () => {
      render(<ArticleList articles={[]} pagination={mockPagination} />);

      expect(screen.queryByTestId("article-card")).not.toBeInTheDocument();
      expect(screen.getByText("No articles found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "There are no articles to display at the moment. Check back later or try refreshing the page."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("should render pagination when pageCount > 1", () => {
      render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByText("Pagination 3 pages")).toBeInTheDocument();
    });

    it("should not render pagination when pageCount <= 1", () => {
      const singlePagePagination = { ...mockPagination, pageCount: 1 };
      render(<ArticleList articles={mockArticles} pagination={singlePagePagination} />);

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("should not render pagination when pagination is undefined", () => {
      render(<ArticleList articles={mockArticles} pagination={undefined} />);

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("should handle different pagination values", () => {
      const customPagination = {
        page: 2,
        pageSize: 5,
        pageCount: 5,
        total: 23,
      };

      render(<ArticleList articles={mockArticles} pagination={customPagination} />);

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-total", "5");
      expect(pagination).toHaveAttribute("data-initial-page", "2");
    });
  });

  describe("URL Parameters", () => {
    it("should handle search params correctly", () => {
      const mockSearchParams = new URLSearchParams("category=tech");
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(mockSearchParams);

      render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

      const pagination = screen.getByTestId("pagination");
      expect(pagination).toHaveAttribute("data-total", "3");
      expect(pagination).toHaveAttribute("data-initial-page", "1");
    });

    it("should handle empty search params", () => {
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(new URLSearchParams());

      render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getAllByTestId("article-card")).toHaveLength(2);
    });
  });

  describe("Layout Structure", () => {
    it("should have correct CSS classes for layout", () => {
      const { container } = render(
        <ArticleList articles={mockArticles} pagination={mockPagination} />
      );

      const section = container.querySelector("section");
      expect(section).toHaveClass("min-h-screen", "py-16");

      const containerDiv = container.querySelector(".container");
      expect(containerDiv).toHaveClass("container", "mx-auto", "px-4", "max-w-7xl");

      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-10");
    });

    it("should handle pagination alignment", () => {
      const { container } = render(
        <ArticleList articles={mockArticles} pagination={mockPagination} />
      );

      const paginationContainer = container.querySelector(".flex.justify-end");
      expect(paginationContainer).toBeInTheDocument();
    });
  });
});
