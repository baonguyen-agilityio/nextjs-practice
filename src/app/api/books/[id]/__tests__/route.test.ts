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

import { apiClient } from "@/services/api";

describe("Books [ID] API Route", () => {
  const mockApiClient = apiClient as any;

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
    it("should successfully retrieve a book by ID", async () => {
      mockApiClient.get.mockResolvedValue(mockBook);

      const request = new Request("http://localhost:3000/api/books/123") as any;
      const params = Promise.resolve({ id: "123" });

      const response = await GET(request, { params });
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/books/123?populate=*");
      expect(result).toEqual(mockBook);
      expect(response.status).toBe(200);
    });

    it("should handle book not found error", async () => {
      const notFoundError = {
        error: {
          status: 404,
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
  });

  describe("PUT /api/books/[id]", () => {
    const updateData = {
      title: "Updated Book Title",
      price: 39.99,
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

    it("should handle update validation errors", async () => {
      const validationError = {
        error: {
          status: 400,
          message: "Validation failed",
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
  });
});
