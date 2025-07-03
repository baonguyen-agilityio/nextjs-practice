import { notFound } from "next/navigation";
import React from "react";
import { render } from "@testing-library/react";
import BookDetailPage, { generateMetadata } from "../page";

jest.mock("@/services/book", () => ({
  getBook: jest.fn(),
}));

jest.mock("@/components/features/book/BookDetails", () => ({
  BookDetails: jest.fn(({ book, isAdmin }) => (
    <div data-testid="book-details">
      <span data-testid="book-title">{book.title}</span>
      <span data-testid="is-admin">{isAdmin ? "admin" : "user"}</span>
    </div>
  )),
}));

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price: number) => `$${price.toFixed(2)}`),
}));

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

const mockGetBook = require("@/services/book").getBook;
const mockAuth = require("@/lib/auth/auth").auth;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;
const mockFormatUSD = require("@/utils/currency").formatUSD;

const mockBook = {
  id: "1",
  title: "Test Book",
  description: "A test book description",
  price: 19.99,
  slug: "test-book",
  language: "en",
  imageUrl: "https://example.com/image.jpg",
  categories: [
    { id: "1", name: "Fiction", documentId: "cat-1" },
    { id: "2", name: "Adventure", documentId: "cat-2" },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  publishedAt: "2024-01-01T00:00:00.000Z",
  documentId: "doc-1",
};

const mockSession = {
  user: {
    id: "user-1",
    email: "test@example.com",
    role: "admin" as const,
  },
};

describe("Book Detail Page (@books/[id])", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatUSD.mockImplementation((price: number) => `$${price.toFixed(2)}`);
  });

  describe("Component", () => {
    it("should render BookDetails with book data and admin role", async () => {
      mockGetBook.mockResolvedValue({
        book: mockBook,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      mockAuth.mockResolvedValue(mockSession);

      const params = Promise.resolve({ id: "1" });
      const component = await BookDetailPage({ params });

      expect(mockGetBook).toHaveBeenCalledWith({ id: "1" });
      expect(mockAuth).toHaveBeenCalled();
      expect(component).toBeDefined();
    });

    it("should render BookDetails with book data and user role", async () => {
      mockGetBook.mockResolvedValue({
        book: mockBook,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      mockAuth.mockResolvedValue({
        user: { ...mockSession.user, role: "user" },
      });

      const params = Promise.resolve({ id: "1" });
      const component = await BookDetailPage({ params });

      expect(mockGetBook).toHaveBeenCalledWith({ id: "1" });
      expect(mockAuth).toHaveBeenCalled();
      expect(component).toBeDefined();
    });

    it("should call notFound when book is not found", async () => {
      mockGetBook.mockResolvedValue({
        book: null,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      mockAuth.mockResolvedValue(mockSession);

      const params = Promise.resolve({ id: "not-found" });
      const result = await BookDetailPage({ params });

      expect(mockGetBook).toHaveBeenCalledWith({ id: "not-found" });
      expect(mockNotFound).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should handle null session", async () => {
      mockGetBook.mockResolvedValue({
        book: mockBook,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      mockAuth.mockResolvedValue(null);

      const params = Promise.resolve({ id: "1" });
      const component = await BookDetailPage({ params });

      expect(mockGetBook).toHaveBeenCalledWith({ id: "1" });
      expect(mockAuth).toHaveBeenCalled();
      expect(component).toBeDefined();
    });
  });

  describe("generateMetadata", () => {
    it("should generate metadata for existing book", async () => {
      mockGetBook.mockResolvedValue({
        book: mockBook,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "1" });
      const metadata = await generateMetadata({ params });

      expect(mockGetBook).toHaveBeenCalledWith({ id: "1" });
      expect(mockFormatUSD).toHaveBeenCalledWith(19.99);
      expect(metadata).toEqual({
        title: "Test Book",
        description: "A test book description",
        keywords: ["Test Book", "Fiction", "Adventure", "books", "buy online"],
        openGraph: {
          title: "Test Book | BookStore",
          description: "A test book description",
          type: "article",
        },
        alternates: {
          canonical: "/books/1",
        },
      });
    });

    it("should generate metadata for book without description", async () => {
      const bookWithoutDescription = { ...mockBook, description: null };
      mockGetBook.mockResolvedValue({
        book: bookWithoutDescription,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "1" });
      const metadata = await generateMetadata({ params });

      expect(metadata.description).toBe(
        "Test Book - Available for $19.99 at BookStore. Order your copy today with fast shipping."
      );
      expect(metadata.openGraph?.description).toBe(
        "Get Test Book at BookStore for $19.99. Fast shipping and excellent customer service."
      );
    });

    it("should generate not found metadata when book is null", async () => {
      mockGetBook.mockResolvedValue({
        book: null,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "not-found" });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: "Book Not Found",
        description: "The requested book could not be found.",
      });
    });
  });

  describe("Async Params", () => {
    it("should handle async params resolution", async () => {
      const params = Promise.resolve({ id: "test-id" });
      const { id } = await params;

      expect(id).toBe("test-id");
      expect(typeof id).toBe("string");
    });

    it("should handle different id formats", async () => {
      const testIds = ["1", "book-123", "special-chars-!@#"];

      for (const testId of testIds) {
        const params = Promise.resolve({ id: testId });
        const { id } = await params;
        expect(id).toBe(testId);
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors", async () => {
      const error = new Error("Service error");
      mockGetBook.mockRejectedValue(error);

      await expect(mockGetBook({ id: "1" })).rejects.toThrow("Service error");
    });

    it("should handle malformed responses", async () => {
      mockGetBook.mockResolvedValue(null as any);

      const result = await mockGetBook({ id: "test" });
      expect(result).toBeNull();
    });
  });
});
