import { getBooks, getBook, createBookService, updateBookService, deleteBook } from "../book";
import { apiClient } from "../api";
import { revalidateTag } from "next/cache";
import { handleApiError } from "@/lib/errors/handleApiError";

jest.mock("../api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

jest.mock("@/lib/errors/handleApiError", () => ({
  handleApiError: jest.fn(),
}));

jest.mock("@/constants", () => ({
  API_ENDPOINTS: {
    BOOKS: "books",
  },
  API_ROUTE_ENDPOINT: {
    BOOKS: "/api/books",
  },
  DOMAIN: "https://api.example.com",
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>;

describe("Book Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBooks", () => {
    it("should successfully fetch books", async () => {
      const mockBooksData = [
        {
          id: "1",
          title: "Test Book 1",
          price: 29.99,
          description: "Test description 1",
          image: { url: "https://example.com/image1.jpg" },
          categories: [],
        },
        {
          id: "2",
          title: "Test Book 2",
          price: 39.99,
          description: "Test description 2",
          image: { url: "https://example.com/image2.jpg" },
          categories: [],
        },
      ];

      const mockResponse = {
        data: mockBooksData,
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 2,
          },
        },
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const searchParams = new URLSearchParams("page=1&pageSize=10");

      const result = await getBooks({ searchParams });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/books?page=1&pageSize=10",
        expect.objectContaining({
          next: expect.objectContaining({
            tags: ["books"],
            revalidate: 3600,
          }),
          baseUrl: "https://api.example.com",
        })
      );

      expect(result).toEqual({
        books: [
          {
            id: "1",
            title: "Test Book 1",
            price: 29.99,
            description: "Test description 1",
            imageUrl: "https://example.com/image1.jpg",
            categories: [],
          },
          {
            id: "2",
            title: "Test Book 2",
            price: 39.99,
            description: "Test description 2",
            imageUrl: "https://example.com/image2.jpg",
            categories: [],
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 2,
        },
        error: null,
      });
    });

    it("should handle API error response", async () => {
      const mockErrorResponse = {
        data: [],
        meta: {},
        error: "Server error",
      };

      mockApiClient.get.mockResolvedValue(mockErrorResponse);
      mockHandleApiError.mockReturnValue({ error: "Parsed server error" });

      const result = await getBooks({});

      expect(mockHandleApiError).toHaveBeenCalledWith("Server error");
      expect(result).toEqual({
        books: [],
        error: "Parsed server error",
      });
    });

    it("should handle books with missing images", async () => {
      const mockBooksData = [
        {
          id: "1",
          title: "Test Book",
          price: 29.99,
          description: "Test description",
          image: null,
          categories: [],
        },
      ];

      const mockResponse = {
        data: mockBooksData,
        meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 1 } },
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getBooks({});

      expect(result.books[0]?.imageUrl).toBe("");
    });

    it("should handle network errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));
      mockHandleApiError.mockReturnValue({ error: "Network connection failed" });

      const result = await getBooks({});

      expect(mockHandleApiError).toHaveBeenCalledWith(expect.any(Error));
      expect(result).toEqual({
        books: [],
        error: "Network connection failed",
      });
    });
  });

  describe("getBook", () => {
    it("should successfully fetch single book", async () => {
      const mockBookData = {
        id: "1",
        title: "Test Book",
        price: 29.99,
        description: "Test description",
        image: { url: "https://example.com/image.jpg" },
        categories: [],
      };

      const mockResponse = {
        data: mockBookData,
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getBook({ id: "1" });

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/books/1",
        expect.objectContaining({
          next: expect.objectContaining({
            tags: ["books", "1"],
            revalidate: 3600,
          }),
          baseUrl: "https://api.example.com",
        })
      );

      expect(result).toEqual({
        book: {
          id: "1",
          title: "Test Book",
          price: 29.99,
          description: "Test description",
          imageUrl: "https://example.com/image.jpg",
          categories: [],
        },
        error: null,
      });
    });

    it("should handle book not found", async () => {
      const mockResponse = {
        data: null,
        error: "Book not found",
      };

      mockApiClient.get.mockResolvedValue(mockResponse);
      mockHandleApiError.mockReturnValue({ error: "Book not found" });

      const result = await getBook({ id: "999" });

      expect(result).toEqual({
        book: null,
        error: "Book not found",
      });
    });

    it("should handle book with missing image", async () => {
      const mockBookData = {
        id: "1",
        title: "Test Book",
        price: 29.99,
        description: "Test description",
        image: {},
        categories: [],
      };

      const mockResponse = {
        data: mockBookData,
        error: null,
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await getBook({ id: "1" });

      expect(result.book?.imageUrl).toBe("");
    });
  });

  describe("createBookService", () => {
    it("should successfully create book", async () => {
      const bookPayload = {
        title: "New Book",
        price: 29.99,
        description: "New book description",
        categories: "fiction",
        image: "image-id",
      };

      const mockResponse = {
        data: { id: "new-book-id" },
        error: null,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await createBookService(bookPayload);

      expect(mockApiClient.post).toHaveBeenCalledWith("/api/books", {
        body: { data: bookPayload },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({ success: true });
    });

    it("should handle creation error", async () => {
      const bookPayload = {
        title: "New Book",
        price: 29.99,
        description: "New book description",
        categories: "fiction",
      };

      const mockResponse = {
        data: null,
        error: "Validation error",
      };

      mockApiClient.post.mockResolvedValue(mockResponse);
      mockHandleApiError.mockReturnValue({ error: { title: ["Title is required"] } });

      const result = await createBookService(bookPayload);

      expect(mockHandleApiError).toHaveBeenCalledWith("Validation error");
      expect(result).toEqual({
        success: false,
        error: { title: ["Title is required"] },
      });
    });

    it("should handle network errors during creation", async () => {
      const bookPayload = {
        title: "New Book",
        price: 29.99,
        description: "New book description",
        categories: "fiction",
      };

      mockApiClient.post.mockRejectedValue(new Error("Network error"));
      mockHandleApiError.mockReturnValue({ error: "Network connection failed" });

      const result = await createBookService(bookPayload);

      expect(result).toEqual({
        success: false,
        error: "Network connection failed",
      });
    });
  });

  describe("updateBookService", () => {
    it("should successfully update book", async () => {
      const bookPayload = {
        title: "Updated Book",
        price: 39.99,
        description: "Updated description",
        categories: "non-fiction",
      };

      const mockResponse = {
        data: { id: "book-123" },
        error: null,
      };

      mockApiClient.put.mockResolvedValue(mockResponse);

      const result = await updateBookService("book-123", bookPayload);

      expect(mockApiClient.put).toHaveBeenCalledWith("/api/books/book-123", {
        body: { data: bookPayload },
        baseUrl: "https://api.example.com",
      });

      expect(mockRevalidateTag).toHaveBeenCalledWith("books");
      expect(result).toEqual({ success: true });
    });

    it("should handle update error", async () => {
      const bookPayload = {
        title: "",
        price: -1,
        description: "",
        categories: "",
      };

      const mockResponse = {
        data: null,
        error: "Validation error",
      };

      mockApiClient.put.mockResolvedValue(mockResponse);
      mockHandleApiError.mockReturnValue({
        error: {
          title: ["Title is required"],
          price: ["Price must be positive"],
        },
      });

      const result = await updateBookService("book-123", bookPayload);

      expect(result).toEqual({
        success: false,
        error: {
          title: ["Title is required"],
          price: ["Price must be positive"],
        },
      });
    });
  });

  describe("deleteBook", () => {
    it("should successfully delete book", async () => {
      const mockResponse = {
        success: true,
        error: null,
      };

      mockApiClient.delete.mockResolvedValue(mockResponse);

      const result = await deleteBook({ id: "book-123" });

      expect(mockApiClient.delete).toHaveBeenCalledWith("/api/books/book-123", {
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        book: null,
        error: null,
      });
    });

    it("should handle delete error", async () => {
      const mockResponse = {
        success: false,
        error: "Book not found",
      };

      mockApiClient.delete.mockResolvedValue(mockResponse);
      mockHandleApiError.mockReturnValue({ error: "Book not found" });

      const result = await deleteBook({ id: "999" });

      expect(mockHandleApiError).toHaveBeenCalledWith("Book not found");
      expect(result).toEqual({
        book: null,
        error: "Book not found",
      });
    });

    it("should handle network errors during deletion", async () => {
      mockApiClient.delete.mockRejectedValue(new Error("Network error"));
      mockHandleApiError.mockReturnValue({ error: "Network connection failed" });

      const result = await deleteBook({ id: "book-123" });

      expect(result).toEqual({
        book: null,
        error: "Network connection failed",
      });
    });
  });
});
