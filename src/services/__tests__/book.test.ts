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
    it("should fetch books with pagination and image handling", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            title: "Test Book",
            price: 29.99,
            description: "Test description",
            image: { url: "https://example.com/image.jpg" },
            categories: [],
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 10,
            pageCount: 1,
            total: 1,
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
            title: "Test Book",
            price: 29.99,
            description: "Test description",
            imageUrl: "https://example.com/image.jpg",
            categories: [],
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 1,
          total: 1,
        },
        error: null,
      });

      (mockResponse.data[0]! as any).image = null;
      mockApiClient.get.mockResolvedValue(mockResponse);

      const resultWithoutImage = await getBooks({});
      expect(resultWithoutImage.books[0]?.imageUrl).toBe("");
    });

    it("should handle errors", async () => {
      const mockErrorResponse = {
        data: [],
        meta: {},
        error: "Server error",
      };

      mockApiClient.get.mockResolvedValue(mockErrorResponse);
      mockHandleApiError.mockReturnValue({ error: "Parsed server error" });

      let result = await getBooks({});

      expect(mockHandleApiError).toHaveBeenCalledWith("Server error");
      expect(result).toEqual({
        books: [],
        error: "Parsed server error",
      });

      mockApiClient.get.mockRejectedValue(new Error("Network error"));
      mockHandleApiError.mockReturnValue({ error: "Network connection failed" });

      result = await getBooks({});
      expect(result).toEqual({
        books: [],
        error: "Network connection failed",
      });
    });
  });

  describe("getBook", () => {
    it("should fetch single book with image handling", async () => {
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

      mockResponse.data.image = {} as any;
      mockApiClient.get.mockResolvedValue(mockResponse);

      const resultWithoutImage = await getBook({ id: "1" });
      expect(resultWithoutImage.book?.imageUrl).toBe("");
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
  });

  describe("createBookService", () => {
    const bookPayload = {
      title: "New Book",
      price: 29.99,
      description: "New book description",
      categories: "fiction",
      image: "image-id",
    };

    it("should create book successfully", async () => {
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

    it("should handle creation errors", async () => {
      const mockErrorResponse = {
        data: null,
        error: "Validation error",
      };

      mockApiClient.post.mockResolvedValue(mockErrorResponse);
      mockHandleApiError.mockReturnValue({ error: { title: ["Title is required"] } });

      let result = await createBookService(bookPayload);

      expect(result).toEqual({
        success: false,
        error: { title: ["Title is required"] },
      });

      mockApiClient.post.mockRejectedValue(new Error("Network error"));
      mockHandleApiError.mockReturnValue({ error: "Network connection failed" });

      result = await createBookService(bookPayload);
      expect(result).toEqual({
        success: false,
        error: "Network connection failed",
      });
    });
  });

  describe("updateBookService", () => {
    it("should update book successfully", async () => {
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

    it("should handle update errors", async () => {
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
    it("should delete book successfully", async () => {
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

    it("should handle deletion errors", async () => {
      const mockErrorResponse = {
        success: false,
        error: "Book not found",
      };

      mockApiClient.delete.mockResolvedValue(mockErrorResponse);
      mockHandleApiError.mockReturnValue({ error: "Book not found" });

      let result = await deleteBook({ id: "999" });

      expect(result).toEqual({
        book: null,
        error: "Book not found",
      });

      mockApiClient.delete.mockRejectedValue(new Error("Network error"));
      mockHandleApiError.mockReturnValue({ error: "Network connection failed" });

      result = await deleteBook({ id: "book-123" });
      expect(result).toEqual({
        book: null,
        error: "Network connection failed",
      });
    });
  });
});
