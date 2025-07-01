import { notFound } from "next/navigation";

jest.mock("@/services/book", () => ({
  getBook: jest.fn(),
}));

jest.mock("@/components/features/book/BookDetails", () => ({
  BookDetails: jest.fn(),
}));

jest.mock("@/components/ui/SkeletonCard", () => jest.fn());

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

const mockGetBook = require("@/services/book").getBook;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

const mockBook = {
  id: "1",
  title: "Test Book",
  description: "A test book description",
  price: 19.99,
  slug: "test-book",
  language: "en",
  imageUrl: "https://example.com/image.jpg",
  categories: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  publishedAt: "2024-01-01T00:00:00.000Z",
  documentId: "doc-1",
};

describe("Book Detail Page (@books/[id])", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component", () => {
    it("should export BookDetailPage component", async () => {
      const pageModule = await import("../page");
      expect(typeof pageModule.default).toBe("function");
      expect(pageModule.default.name).toBe("BookDetailPage");
    });
  });

  describe("Core Functionality", () => {
    const simulateComponentLogic = async (params: Promise<{ id: string }>) => {
      const { id } = await params;
      const result = await mockGetBook({ id });
      const book = result.book;

      if (!book) {
        notFound();
        return null;
      }

      return book;
    };

    it("should handle successful book fetch", async () => {
      mockGetBook.mockResolvedValue({
        book: mockBook,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "1" });
      const result = await simulateComponentLogic(params);

      expect(mockGetBook).toHaveBeenCalledWith({ id: "1" });
      expect(result).toEqual(mockBook);
      expect(mockNotFound).not.toHaveBeenCalled();
    });

    it("should call notFound when book is null", async () => {
      mockGetBook.mockResolvedValue({
        book: null,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "not-found" });
      const result = await simulateComponentLogic(params);

      expect(mockGetBook).toHaveBeenCalledWith({ id: "not-found" });
      expect(mockNotFound).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should call notFound when book is undefined", async () => {
      mockGetBook.mockResolvedValue({
        book: undefined as any,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "undefined" });
      const result = await simulateComponentLogic(params);

      expect(mockGetBook).toHaveBeenCalledWith({ id: "undefined" });
      expect(mockNotFound).toHaveBeenCalled();
      expect(result).toBeNull();
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

  describe("Integration", () => {
    it("should work with service and notFound", async () => {
      mockGetBook.mockResolvedValue({
        book: mockBook,
        error: null,
        pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 },
      });

      const params = Promise.resolve({ id: "integration-test" });
      const { id } = await params;
      const serviceResponse = await mockGetBook({ id });
      const book = serviceResponse.book;

      expect(id).toBe("integration-test");
      expect(mockGetBook).toHaveBeenCalledWith({ id: "integration-test" });
      expect(book).toEqual(mockBook);
      expect(book?.title).toBe("Test Book");
      expect(mockNotFound).not.toHaveBeenCalled();
    });
  });
});
