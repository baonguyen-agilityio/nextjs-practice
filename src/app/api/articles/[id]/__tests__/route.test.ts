import { GET } from "../route";
import type { ArticleStrapiModel } from "@/types";

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

  get headers() {
    return {
      get: (name: string) => this.init?.headers?.[name as keyof HeadersInit] || null,
    };
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
  },
}));

jest.mock("@/constants", () => ({
  API_ENDPOINTS: {
    ARTICLES: "/articles",
  },
}));

import { apiClient } from "@/services/api";

describe("Article by ID API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/articles/[id]", () => {
    const mockArticleResponse = {
      data: {
        id: "1",
        slug: "javascript-guide",
        title: "JavaScript Complete Guide",
        description: "A comprehensive guide to JavaScript programming language",
        content:
          "JavaScript is a versatile programming language that powers the web. In this comprehensive guide, we'll explore all aspects of JavaScript from basic syntax to advanced concepts...",
        image: {
          url: "/uploads/js-guide.jpg",
        },
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        publishedAt: "2024-01-01T00:00:00.000Z",
        author: {
          name: "John Doe",
        },
        documentId: "article-doc-1",
      } as ArticleStrapiModel,
    };

    it("should successfully fetch article by ID", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/1?populate=*");
      expect(result).toEqual(mockArticleResponse);
      expect(response.status).toBe(200);
    });

    it("should handle numeric ID", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/123") as any;
      const params = Promise.resolve({ id: "123" });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/123?populate=*");
      expect(response.status).toBe(200);
    });

    it("should handle string ID", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/javascript-guide") as any;
      const params = Promise.resolve({ id: "javascript-guide" });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/javascript-guide?populate=*");
      expect(response.status).toBe(200);
    });

    it("should handle UUID format ID", async () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request(`http://localhost:3000/api/articles/${uuid}`) as any;
      const params = Promise.resolve({ id: uuid });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith(`/articles/${uuid}?populate=*`);
      expect(response.status).toBe(200);
    });

    it("should always include populate=* parameter", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      await GET(request, { params });

      const calledUrl = mockApiClient.get.mock.calls[0]?.[0];
      expect(calledUrl).toContain("populate=*");
    });

    it("should decode URI components correctly", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const encodedId = "my%20article%20slug";
      const request = new Request(`http://localhost:3000/api/articles/${encodedId}`) as any;
      const params = Promise.resolve({ id: "my article slug" });
      await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/my article slug?populate=*");
    });

    it("should handle article not found", async () => {
      const notFoundResponse = {
        data: null,
        error: {
          status: 404,
          name: "NotFoundError",
          message: "Article not found",
        },
      };

      mockApiClient.get.mockResolvedValue(notFoundResponse);

      const request = new Request("http://localhost:3000/api/articles/nonexistent") as any;
      const params = Promise.resolve({ id: "nonexistent" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toEqual(notFoundResponse);
      expect(response.status).toBe(200);
    });

    it("should handle network errors", async () => {
      const error = new Error("Network error");
      mockApiClient.get.mockRejectedValue(error);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });

      await expect(GET(request, { params })).rejects.toThrow("Network error");
    });

    it("should handle Strapi server errors", async () => {
      const serverErrorResponse = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Internal server error",
        },
      };

      mockApiClient.get.mockResolvedValue(serverErrorResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toEqual(serverErrorResponse);
      expect(response.status).toBe(200);
    });

    it("should return proper article data structure", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toHaveProperty("data");

      const article = result.data;
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("slug");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("description");
      expect(article).toHaveProperty("content");
      expect(article).toHaveProperty("image");
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("createdAt");
      expect(article).toHaveProperty("updatedAt");
      expect(article).toHaveProperty("publishedAt");
      expect(article).toHaveProperty("documentId");

      expect(article.image).toHaveProperty("url");
      expect(article.author).toHaveProperty("name");
    });

    it("should handle special characters in article ID", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const specialId = "c++%20programming%20guide";
      const request = new Request(`http://localhost:3000/api/articles/${specialId}`) as any;
      const params = Promise.resolve({ id: "c++ programming guide" });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/c++ programming guide?populate=*");
      expect(response.status).toBe(200);
    });

    it("should validate article content structure", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      const article = result.data;

      expect(typeof article.id).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.description).toBe("string");
      expect(typeof article.content).toBe("string");
      expect(typeof article.slug).toBe("string");
      expect(typeof article.createdAt).toBe("string");
      expect(typeof article.publishedAt).toBe("string");
      expect(typeof article.author.name).toBe("string");
      expect(typeof article.image.url).toBe("string");
    });

    it("should handle malformed ID gracefully", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const malformedId = "   ";
      const request = new Request("http://localhost:3000/api/articles/%20%20%20") as any;
      const params = Promise.resolve({ id: malformedId });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/   ?populate=*");
      expect(response.status).toBe(200);
    });

    it("should preserve response headers", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });

      expect(response.headers.get("content-type")).toBe("application/json");
    });

    it("should handle empty response data", async () => {
      const emptyResponse = {
        data: null,
      };

      mockApiClient.get.mockResolvedValue(emptyResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(result.data).toBeNull();
      expect(response.status).toBe(200);
    });

    it("should handle unauthorized access", async () => {
      const unauthorizedResponse = {
        error: {
          status: 401,
          name: "UnauthorizedError",
          message: "Unauthorized access",
        },
      };

      mockApiClient.get.mockResolvedValue(unauthorizedResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toEqual(unauthorizedResponse);
      expect(response.status).toBe(200);
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      mockApiClient.get.mockRejectedValue(timeoutError);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });

      await expect(GET(request, { params })).rejects.toThrow("Request timeout");
    });

    it("should handle very long article IDs", async () => {
      const longId = "a".repeat(1000);
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request(`http://localhost:3000/api/articles/${longId}`) as any;
      const params = Promise.resolve({ id: longId });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith(`/articles/${longId}?populate=*`);
      expect(response.status).toBe(200);
    });
  });
});
