import { GET, PUT, DELETE } from "../route";
import type { BookStrapiModel } from "@/types";

global.Response = class Response {
  constructor(
    public body?: any,
    public init?: ResponseInit
  ) {}

  static json(data: any) {
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  }

  async json() {
    return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
  }

  get status() {
    return this.init?.status || 200;
  }
} as any;

global.Request = class Request {
  constructor(
    public url: string,
    public init?: RequestInit
  ) {}

  async json() {
    return this.init?.body ? JSON.parse(this.init.body as string) : {};
  }
} as any;

jest.mock("@/services/api", () => ({
  apiClient: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/constants", () => ({
  API_ENDPOINTS: {
    BOOKS: "/books",
  },
}));

import { apiClient } from "@/services/api";

describe("Books [ID] API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBook: BookStrapiModel = {
    id: "book-123",
    documentId: "doc-123",
    slug: "test-book",
    title: "Test Book",
    description: "A test book description",
    price: 29.99,
    language: "en",
    publishedAt: "2024-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    categories: [
      {
        id: 1,
        name: "Fiction",
        documentId: "cat-doc-1",
      },
    ],
    image: {
      url: "https://example.com/book-cover.jpg",
    },
  };

  describe("GET /api/books/[id]", () => {
    it("should successfully retrieve a book by numeric ID", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/123") as any;
      const params = Promise.resolve({ id: "123" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/123?populate=*");
      expect(result).toEqual(mockBook);
      expect(response.status).toBe(200);
    });

    it("should successfully retrieve a book by string ID", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/book-123") as any;
      const params = Promise.resolve({ id: "book-123" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/book-123?populate=*");
      expect(result).toEqual(mockBook);
    });

    it("should successfully retrieve a book by UUID", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request(
        "http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440000"
      ) as any;
      const params = Promise.resolve({ id: "550e8400-e29b-41d4-a716-446655440000" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/books/550e8400-e29b-41d4-a716-446655440000?populate=*"
      );
      expect(result).toEqual(mockBook);
    });

    it("should handle book not found error", async () => {
      const notFoundError = {
        error: {
          status: 404,
          name: "NotFoundError",
          message: "Book not found",
        },
      };

      mockApiClient.get.mockResolvedValue(notFoundError);

      const request = new Request("http://localhost:3000/api/books/999") as any;
      const params = Promise.resolve({ id: "999" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toEqual(notFoundError);
    });

    it("should handle invalid ID format", async () => {
      const invalidIdError = {
        error: {
          status: 400,
          name: "ValidationError",
          message: "Invalid ID format",
        },
      };

      mockApiClient.get.mockResolvedValue(invalidIdError);

      const request = new Request("http://localhost:3000/api/books/invalid-id@#$") as any;
      const params = Promise.resolve({ id: "invalid-id@#$" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toEqual(invalidIdError);
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockApiClient.get.mockRejectedValue(networkError);

      const request = new Request("http://localhost:3000/api/books/123") as any;
      const params = Promise.resolve({ id: "123" });

      await expect(GET(request, { params })).rejects.toThrow("Network connection failed");
    });

    it("should include populate parameter in URL", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/123") as any;
      const params = Promise.resolve({ id: "123" });

      await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/123?populate=*");
    });

    it("should handle server errors", async () => {
      const serverError = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Internal server error",
        },
      };

      mockApiClient.get.mockResolvedValue(serverError);

      const request = new Request("http://localhost:3000/api/books/123") as any;
      const params = Promise.resolve({ id: "123" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toEqual(serverError);
    });
  });

  describe("PUT /api/books/[id]", () => {
    const updateData = {
      title: "Updated Book Title",
      price: 39.99,
      description: "Updated description",
    };

    it("should successfully update a book", async () => {
      const updatedBook = { ...mockBook, ...updateData };
      mockApiClient.put.mockResolvedValue(updatedBook);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "PUT",
        body: JSON.stringify(updateData),
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await PUT(request, { params });
      const result = await response.json();

      expect(mockApiClient.put).toHaveBeenCalledWith("/books/123", {
        body: updateData,
      });
      expect(result).toEqual(updatedBook);
      expect(response.status).toBe(200);
    });

    it("should handle partial updates", async () => {
      const partialUpdate = { price: 45.99 };
      const updatedBook = { ...mockBook, price: 45.99 };
      mockApiClient.put.mockResolvedValue(updatedBook);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "PUT",
        body: JSON.stringify(partialUpdate),
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await PUT(request, { params });
      const result = await response.json();

      expect(mockApiClient.put).toHaveBeenCalledWith("/books/123", {
        body: partialUpdate,
      });
      expect(result.price).toBe(45.99);
    });

    it("should handle update validation errors", async () => {
      const validationError = {
        error: {
          status: 400,
          name: "ValidationError",
          message: "Title is required",
          details: {
            errors: [
              {
                path: ["title"],
                message: "Title is a required field",
                name: "ValidationError",
              },
            ],
          },
        },
      };

      mockApiClient.put.mockResolvedValue(validationError);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "PUT",
        body: JSON.stringify({ title: "" }),
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await PUT(request, { params });
      const result = await response.json();

      expect(result).toEqual(validationError);
    });

    it("should handle book not found for update", async () => {
      const notFoundError = {
        error: {
          status: 404,
          name: "NotFoundError",
          message: "Book not found",
        },
      };

      mockApiClient.put.mockResolvedValue(notFoundError);

      const request = new Request("http://localhost:3000/api/books/999", {
        method: "PUT",
        body: JSON.stringify(updateData),
      }) as any;
      const params = Promise.resolve({ id: "999" });

      const response = await PUT(request, { params });
      const result = await response.json();

      expect(result).toEqual(notFoundError);
    });

    it("should handle malformed JSON in request body", async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as any;
      const params = Promise.resolve({ id: "123" });

      await expect(PUT(request, { params })).rejects.toThrow("Invalid JSON");
    });

    it("should handle empty request body", async () => {
      mockApiClient.put.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "PUT",
        body: JSON.stringify({}),
      }) as any;
      const params = Promise.resolve({ id: "123" });

      await PUT(request, { params });

      expect(mockApiClient.put).toHaveBeenCalledWith("/books/123", {
        body: {},
      });
    });

    it("should handle concurrent update conflicts", async () => {
      const conflictError = {
        error: {
          status: 409,
          name: "ConflictError",
          message: "Resource has been modified by another request",
        },
      };

      mockApiClient.put.mockResolvedValue(conflictError);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "PUT",
        body: JSON.stringify(updateData),
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await PUT(request, { params });
      const result = await response.json();

      expect(result).toEqual(conflictError);
    });
  });

  describe("DELETE /api/books/[id]", () => {
    it("should successfully delete a book", async () => {
      const deleteResponse = { success: true, message: "Book deleted successfully" };
      mockApiClient.delete.mockResolvedValue(deleteResponse);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "DELETE",
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(mockApiClient.delete).toHaveBeenCalledWith("/books/123");
      expect(result).toEqual(deleteResponse);
      expect(response.status).toBe(200);
    });

    it("should handle book not found for deletion", async () => {
      const notFoundError = {
        error: {
          status: 404,
          name: "NotFoundError",
          message: "Book not found",
        },
      };

      mockApiClient.delete.mockResolvedValue(notFoundError);

      const request = new Request("http://localhost:3000/api/books/999", {
        method: "DELETE",
      }) as any;
      const params = Promise.resolve({ id: "999" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(notFoundError);
    });

    it("should handle deletion of book with references", async () => {
      const referenceError = {
        error: {
          status: 409,
          name: "ConflictError",
          message: "Cannot delete book with existing cart items",
        },
      };

      mockApiClient.delete.mockResolvedValue(referenceError);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "DELETE",
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(referenceError);
    });

    it("should handle network errors during deletion", async () => {
      const networkError = new Error("Network connection failed");
      mockApiClient.delete.mockRejectedValue(networkError);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "DELETE",
      }) as any;
      const params = Promise.resolve({ id: "123" });

      await expect(DELETE(request, { params })).rejects.toThrow("Network connection failed");
    });

    it("should handle permission errors", async () => {
      const permissionError = {
        error: {
          status: 403,
          name: "ForbiddenError",
          message: "You don't have permission to delete this book",
        },
      };

      mockApiClient.delete.mockResolvedValue(permissionError);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "DELETE",
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(permissionError);
    });

    it("should handle server errors during deletion", async () => {
      const serverError = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Failed to delete book",
        },
      };

      mockApiClient.delete.mockResolvedValue(serverError);

      const request = new Request("http://localhost:3000/api/books/123", {
        method: "DELETE",
      }) as any;
      const params = Promise.resolve({ id: "123" });

      const response = await DELETE(request, { params });
      const result = await response.json();

      expect(result).toEqual(serverError);
    });
  });

  describe("Parameter handling", () => {
    it("should handle async params resolution", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/test-id") as any;
      const params = Promise.resolve({ id: "test-id" });

      await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/test-id?populate=*");
    });

    it("should handle special characters in ID", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/book-123_test") as any;
      const params = Promise.resolve({ id: "book-123_test" });

      await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/book-123_test?populate=*");
    });

    it("should handle URL encoding in ID", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/book%20with%20space") as any;
      const params = Promise.resolve({ id: "book with space" });

      await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/book with space?populate=*");
    });
  });
});
