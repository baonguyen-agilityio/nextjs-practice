import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArticleList from "../ArticleList";
import type { Article, MetaResponse } from "@/types";

// Mock functions
const mockReplace = jest.fn();
const mockStartTransition = jest.fn((callback) => callback());

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/articles"),
  useRouter: jest.fn(() => ({ replace: mockReplace })),
  useSearchParams: jest.fn(),
}));

// Mock React useTransition
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useTransition: jest.fn(() => [false, mockStartTransition]),
}));

// Mock UI components
jest.mock("@/components/features/article/ArticleCard", () => ({
  ArticleCard: ({ article }: { article: Article }) => (
    <div data-testid="article-card">{article.title}</div>
  ),
}));

jest.mock("@/components/ui/Banner", () => ({
  Banner: ({ title }: any) => <div data-testid="banner">{title}</div>,
}));

jest.mock("@/components/ui/SkeletonList", () => {
  return function MockSkeletonList() {
    return <div data-testid="skeleton-list">Loading...</div>;
  };
});

jest.mock("@/components/ui/EmptyState/variants", () => ({
  ArticlesEmptyState: () => <div data-testid="articles-empty-state">No articles</div>,
  SearchEmptyState: ({ searchTerm }: { searchTerm?: string }) => (
    <div data-testid="search-empty-state">No results for: {searchTerm}</div>
  ),
}));

// Simple pagination mock that can be customized per test
const mockPaginationOnChange = jest.fn();
jest.mock("@/components/ui/Pagination", () => {
  return function MockPagination({ total, initialPage, onChange }: any) {
    // Store onChange for external triggering
    mockPaginationOnChange.mockImplementation(onChange);
    return (
      <div data-testid="pagination">
        Page {initialPage} of {total}
      </div>
    );
  };
});

describe("ArticleList", () => {
  // Helper functions
  const createArticle = (id: string, title: string): Article => ({
    id,
    documentId: `doc-${id}`,
    slug: `slug-${id}`,
    title,
    description: `Description ${id}`,
    content: `Content ${id}`,
    imageUrl: `/image${id}.jpg`,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
    author: { name: `Author ${id}` },
  });

  const createPagination = (page = 1, pageCount = 3): MetaResponse["pagination"] => ({
    page,
    pageSize: 10,
    pageCount,
    total: 25,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked function and set default return value
    const { useSearchParams } = require("next/navigation");
    useSearchParams.mockReturnValue(new URLSearchParams());

    // Reset useTransition to non-pending state
    const mockReact = require("react");
    mockReact.useTransition.mockReturnValue([false, mockStartTransition]);
  });

  describe("Rendering", () => {
    it("renders banner and articles list", () => {
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination()} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getByText("Articles")).toBeInTheDocument();
      expect(screen.getByTestId("article-card")).toBeInTheDocument();
      expect(screen.getByText("Test Article")).toBeInTheDocument();
    });

    it("renders multiple articles", () => {
      const articles = [createArticle("1", "Article 1"), createArticle("2", "Article 2")];

      render(<ArticleList articles={articles} pagination={createPagination()} />);

      expect(screen.getAllByTestId("article-card")).toHaveLength(2);
    });
  });

  describe("Loading state", () => {
    it("shows skeleton when pending", () => {
      const mockReact = require("react");
      mockReact.useTransition.mockReturnValue([true, mockStartTransition]);

      render(<ArticleList articles={[]} pagination={createPagination()} />);

      expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
    });
  });

  describe("Empty states", () => {
    it("shows articles empty state when no search", () => {
      render(<ArticleList articles={[]} pagination={createPagination()} />);

      expect(screen.getByTestId("articles-empty-state")).toBeInTheDocument();
    });

    it("shows search empty state when search exists", () => {
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(new URLSearchParams("search=test"));

      render(<ArticleList articles={[]} pagination={createPagination()} />);

      expect(screen.getByTestId("search-empty-state")).toBeInTheDocument();
      expect(screen.getByText("No results for: test")).toBeInTheDocument();
    });

    it("shows articles empty state when search is empty string", () => {
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(new URLSearchParams("search="));

      render(<ArticleList articles={[]} pagination={createPagination()} />);

      // Empty search string should be treated as no search
      expect(screen.getByTestId("articles-empty-state")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("shows pagination when pageCount > 1", () => {
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination(1, 3)} />);

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    it("hides pagination when pageCount = 1", () => {
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination(1, 1)} />);

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });

    it("hides pagination when pagination is undefined", () => {
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={undefined} />);

      expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    });
  });

  describe("Page navigation", () => {
    it("navigates to page 2 and adds page param", () => {
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination(1, 3)} />);

      // Trigger page change to page 2
      mockPaginationOnChange(2);

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/articles?page=2");
    });

    it("navigates to page 1 and removes page param", () => {
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(new URLSearchParams("page=2"));
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination(2, 3)} />);

      // Trigger page change to page 1
      mockPaginationOnChange(1);

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/articles?");
    });

    it("preserves other search params when changing page", () => {
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(new URLSearchParams("search=test&category=tech"));
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination(1, 3)} />);

      // Trigger page change to page 2
      mockPaginationOnChange(2);

      expect(mockReplace).toHaveBeenCalledWith("/articles?search=test&category=tech&page=2");
    });

    it("preserves other params when navigating to page 1", () => {
      const { useSearchParams } = require("next/navigation");
      useSearchParams.mockReturnValue(new URLSearchParams("search=test&page=3"));
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination(3, 3)} />);

      // Trigger page change to page 1
      mockPaginationOnChange(1);

      expect(mockReplace).toHaveBeenCalledWith("/articles?search=test");
    });
  });

  describe("Edge cases", () => {
    it("handles null/undefined searchParams gracefully", () => {
      const { usePathname, useSearchParams } = require("next/navigation");
      usePathname.mockReturnValue("");
      useSearchParams.mockReturnValue(null);

      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={createPagination()} />);

      expect(screen.getByTestId("banner")).toBeInTheDocument();
      expect(screen.getByTestId("article-card")).toBeInTheDocument();
    });

    it("handles pagination with only page and pageCount properties", () => {
      const minimalPagination = { page: 2, pageCount: 5 } as MetaResponse["pagination"];
      const articles = [createArticle("1", "Test Article")];

      render(<ArticleList articles={articles} pagination={minimalPagination} />);

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });
  });
});
