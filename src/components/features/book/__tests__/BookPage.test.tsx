import { render, screen } from "@testing-library/react";
import BookPage from "../BookPage";
import type { Book, Category } from "@/types";

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/services", () => ({
  getBooks: jest.fn(),
}));

jest.mock("@/services/category", () => ({
  getCategories: jest.fn(),
}));

jest.mock("../BookList", () => {
  return function MockBookList({ books, pagination, isAdmin, categories }: any) {
    return (
      <div data-testid="book-list">
        <div data-testid="books-count">{books.length}</div>
        <div data-testid="is-admin">{isAdmin ? "admin" : "user"}</div>
        <div data-testid="categories-count">{categories.length}</div>
        <div data-testid="page-size">{pagination?.pageSize}</div>
        <div data-testid="page-count">{pagination?.pageCount}</div>
        <div data-testid="total">{pagination?.total}</div>
      </div>
    );
  };
});

describe("BookPage", () => {
  const mockBooks: Book[] = [
    {
      id: "1",
      documentId: "doc-1",
      slug: "book-1",
      title: "Test Book 1",
      price: 19.99,
      language: "en",
      description: "First test book",
      imageUrl: "/book1.jpg",
      categories: [],
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      publishedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      documentId: "doc-2",
      slug: "book-2",
      title: "Test Book 2",
      price: 29.99,
      language: "en",
      description: "Second test book",
      imageUrl: "/book2.jpg",
      categories: [],
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
      publishedAt: "2023-01-02T00:00:00.000Z",
    },
  ];

  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockPagination = {
    page: 1,
    pageSize: 10,
    pageCount: 5,
    total: 45,
  };

  const mockSearchParams = new URLSearchParams("?page=1&pageSize=10");

  let mockAuth: jest.Mock;
  let mockGetBooks: jest.Mock;
  let mockGetCategories: jest.Mock;

  beforeEach(() => {
    mockAuth = require("@/lib/auth/auth").auth;
    mockGetBooks = require("@/services").getBooks;
    mockGetCategories = require("@/services/category").getCategories;

    jest.clearAllMocks();

    mockGetBooks.mockResolvedValue({
      books: mockBooks,
      pagination: mockPagination,
    });

    mockGetCategories.mockResolvedValue({
      data: mockCategories,
    });
  });

  describe("Component Rendering", () => {
    it("should render BookList with books and pagination for non-admin user", async () => {
      mockAuth.mockResolvedValue({
        user: { role: "user" },
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("book-list")).toBeInTheDocument();
      expect(screen.getByTestId("books-count")).toHaveTextContent("2");
      expect(screen.getByTestId("is-admin")).toHaveTextContent("user");
      expect(screen.getByTestId("categories-count")).toHaveTextContent("2");
      expect(screen.getByTestId("page-size")).toHaveTextContent("10");
      expect(screen.getByTestId("page-count")).toHaveTextContent("5");
      expect(screen.getByTestId("total")).toHaveTextContent("45");
    });

    it("should render BookList with admin privileges for admin user", async () => {
      mockAuth.mockResolvedValue({
        user: { role: "admin" },
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("book-list")).toBeInTheDocument();
      expect(screen.getByTestId("is-admin")).toHaveTextContent("admin");
    });

    it("should render BookList for user without session", async () => {
      mockAuth.mockResolvedValue(null);

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("book-list")).toBeInTheDocument();
      expect(screen.getByTestId("is-admin")).toHaveTextContent("user");
    });
  });

  describe("Data Fetching", () => {
    it("should call getBooks with search params", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(mockGetBooks).toHaveBeenCalledWith({
        searchParams: mockSearchParams,
      });
    });

    it("should call getCategories to fetch categories", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(mockGetCategories).toHaveBeenCalled();
    });

    it("should pass correct data to BookList component", async () => {
      mockAuth.mockResolvedValue({ user: { role: "admin" } });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("books-count")).toHaveTextContent("2");
      expect(screen.getByTestId("categories-count")).toHaveTextContent("2");
      expect(screen.getByTestId("is-admin")).toHaveTextContent("admin");
    });
  });

  describe("Role-based Access", () => {
    it("should set isAdmin to true for admin users", async () => {
      mockAuth.mockResolvedValue({
        user: { role: "admin" },
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("is-admin")).toHaveTextContent("admin");
    });

    it("should set isAdmin to false for regular users", async () => {
      mockAuth.mockResolvedValue({
        user: { role: "user" },
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("is-admin")).toHaveTextContent("user");
    });

    it("should set isAdmin to false for users with undefined role", async () => {
      mockAuth.mockResolvedValue({
        user: {},
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("is-admin")).toHaveTextContent("user");
    });

    it("should set isAdmin to false when no session exists", async () => {
      mockAuth.mockResolvedValue(null);

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("is-admin")).toHaveTextContent("user");
    });
  });

  describe("Search Parameters", () => {
    it("should handle different search parameters", async () => {
      const customSearchParams = new URLSearchParams("?search=test&page=2&categories=fiction");
      mockAuth.mockResolvedValue({ user: { role: "user" } });

      render(await BookPage({ searchParamsAPI: customSearchParams }));

      expect(mockGetBooks).toHaveBeenCalledWith({
        searchParams: customSearchParams,
      });
    });

    it("should handle empty search parameters", async () => {
      const emptySearchParams = new URLSearchParams();
      mockAuth.mockResolvedValue({ user: { role: "user" } });

      render(await BookPage({ searchParamsAPI: emptySearchParams }));

      expect(mockGetBooks).toHaveBeenCalledWith({
        searchParams: emptySearchParams,
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle auth failure gracefully", async () => {
      mockAuth.mockRejectedValue(new Error("Auth failed"));

      await expect(BookPage({ searchParamsAPI: mockSearchParams })).rejects.toThrow("Auth failed");
    });

    it("should handle getBooks failure gracefully", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetBooks.mockRejectedValue(new Error("Failed to fetch books"));

      await expect(BookPage({ searchParamsAPI: mockSearchParams })).rejects.toThrow(
        "Failed to fetch books"
      );
    });

    it("should handle getCategories failure gracefully", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetCategories.mockRejectedValue(new Error("Failed to fetch categories"));

      await expect(BookPage({ searchParamsAPI: mockSearchParams })).rejects.toThrow(
        "Failed to fetch categories"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty books array", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetBooks.mockResolvedValue({
        books: [],
        pagination: { ...mockPagination, total: 0 },
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("books-count")).toHaveTextContent("0");
      expect(screen.getByTestId("total")).toHaveTextContent("0");
    });

    it("should handle empty categories array", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetCategories.mockResolvedValue({
        data: [],
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("categories-count")).toHaveTextContent("0");
    });

    it("should handle missing pagination data", async () => {
      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetBooks.mockResolvedValue({
        books: mockBooks,
        pagination: undefined,
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("books-count")).toHaveTextContent("2");
      expect(screen.getByTestId("page-size")).toHaveTextContent("");
    });

    it("should handle malformed search params", async () => {
      const malformedParams = new URLSearchParams("?page=invalid&pageSize=notanumber");
      mockAuth.mockResolvedValue({ user: { role: "user" } });

      render(await BookPage({ searchParamsAPI: malformedParams }));

      expect(mockGetBooks).toHaveBeenCalledWith({
        searchParams: malformedParams,
      });
    });
  });

  describe("Data Structure Validation", () => {
    it("should handle books with missing optional fields", async () => {
      const booksWithMissingFields = [
        {
          id: "1",
          documentId: "doc-1",
          slug: "book-1",
          title: "Test Book",
          price: 19.99,
          language: "",
          description: "Test description",
          imageUrl: "",
          categories: [],
          createdAt: "2023-01-01T00:00:00.000Z",
          updatedAt: "2023-01-01T00:00:00.000Z",
          publishedAt: "2023-01-01T00:00:00.000Z",
        },
      ];

      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetBooks.mockResolvedValue({
        books: booksWithMissingFields,
        pagination: mockPagination,
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("books-count")).toHaveTextContent("1");
    });

    it("should handle categories with all required fields", async () => {
      const categoriesComplete = [
        { id: 1, documentId: "cat-1", name: "Complete Category 1" },
        { id: 2, documentId: "cat-2", name: "Complete Category 2" },
      ];

      mockAuth.mockResolvedValue({ user: { role: "user" } });
      mockGetCategories.mockResolvedValue({
        data: categoriesComplete,
      });

      render(await BookPage({ searchParamsAPI: mockSearchParams }));

      expect(screen.getByTestId("categories-count")).toHaveTextContent("2");
    });
  });
});
