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

  it("should render banner with correct title and description", () => {
    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    const banner = screen.getByTestId("banner");
    expect(banner).toHaveTextContent("Articles - There are many variations of passages");
  });

  it("should render articles when not pending", () => {
    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();
    expect(screen.getAllByTestId("article-card")).toHaveLength(2);
  });

  it("should handle component structure with proper CSS classes", () => {
    const { container } = render(
      <ArticleList articles={mockArticles} pagination={mockPagination} />
    );

    const section = container.querySelector("section.min-h-screen.py-16");
    expect(section).toBeInTheDocument();

    const containerDiv = container.querySelector(".container.mx-auto.px-4.max-w-7xl");
    expect(containerDiv).toBeInTheDocument();

    const grid = container.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-10"
    );
    expect(grid).toBeInTheDocument();
  });

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

  it("should handle page change URL params correctly", () => {
    const mockSearchParams = new URLSearchParams("category=tech");
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue(mockSearchParams);

    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    const pagination = screen.getByTestId("pagination");
    expect(pagination).toHaveAttribute("data-total", "3");
    expect(pagination).toHaveAttribute("data-initial-page", "1");
  });

  it("should handle different search params correctly", () => {
    const mockSearchParams = new URLSearchParams("page=3&filter=popular");
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue(mockSearchParams);

    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getAllByTestId("article-card")).toHaveLength(2);
  });

  it("should handle empty articles array", () => {
    render(<ArticleList articles={[]} pagination={mockPagination} />);

    expect(screen.queryByTestId("article-card")).not.toBeInTheDocument();
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("should use correct CSS classes for layout", () => {
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

  it("should handle pagination with default values when undefined", () => {
    render(<ArticleList articles={mockArticles} pagination={undefined} />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("article-card")).toHaveLength(2);
  });

  it("should use memoized params correctly", () => {
    const mockSearchParams = new URLSearchParams("category=tech");
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue(mockSearchParams);

    const { rerender } = render(
      <ArticleList articles={mockArticles} pagination={mockPagination} />
    );

    rerender(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    expect(screen.getByTestId("banner")).toBeInTheDocument();
  });

  it("should handle pagination alignment correctly", () => {
    const { container } = render(
      <ArticleList articles={mockArticles} pagination={mockPagination} />
    );

    const paginationContainer = container.querySelector(".flex.justify-end");
    expect(paginationContainer).toBeInTheDocument();
  });

  it("should handle different page and pageCount values", () => {
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

  it("should handle null/empty searchParams", () => {
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue("");

    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    expect(screen.getByTestId("banner")).toBeInTheDocument();
    expect(screen.getAllByTestId("article-card")).toHaveLength(2);
  });

  it("should handle null pathname", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("");

    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    expect(screen.getByTestId("banner")).toBeInTheDocument();
  });

  it("should render articles with correct keys", () => {
    render(<ArticleList articles={mockArticles} pagination={mockPagination} />);

    const articleCards = screen.getAllByTestId("article-card");
    expect(articleCards).toHaveLength(2);

    expect(articleCards[0]).toHaveTextContent("Article 1");
    expect(articleCards[1]).toHaveTextContent("Article 2");
  });

  it("should handle useCallback dependencies correctly", () => {
    const mockSearchParams = new URLSearchParams("test=value");
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue(mockSearchParams);

    const { rerender } = render(
      <ArticleList articles={mockArticles} pagination={mockPagination} />
    );

    const newArticles = [
      {
        id: "3",
        documentId: "doc-3",
        slug: "article-3",
        title: "Article 3",
        description: "Description 3",
        content: "Content 3",
        imageUrl: "/image3.jpg",
        createdAt: "2023-01-03T00:00:00.000Z",
        updatedAt: "2023-01-03T00:00:00.000Z",
        publishedAt: "2023-01-03T00:00:00.000Z",
        author: { name: "Author 3" },
      },
    ];

    rerender(<ArticleList articles={newArticles} pagination={mockPagination} />);

    expect(screen.getByText("Article 3")).toBeInTheDocument();
  });

  it("should handle pagination defaultValues correctly", () => {
    const paginationWithoutPageCount = {
      page: 2,
      pageSize: 10,
      total: 25,
    } as MetaResponse["pagination"];

    render(<ArticleList articles={mockArticles} pagination={paginationWithoutPageCount} />);

    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });
});
