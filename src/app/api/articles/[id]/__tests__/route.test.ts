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

import { apiClient } from "@/services/api";

describe("Article by ID API Route", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/articles/[id]", () => {
    const mockArticleResponse = {
      data: {
        id: "1",
        slug: "test-article",
        title: "Test Article",
        description: "Test description",
        content: "Test content",
        image: { url: "/test.jpg" },
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        publishedAt: "2024-01-01T00:00:00.000Z",
        author: { name: "Test Author" },
        documentId: "test-doc",
      } as ArticleStrapiModel,
    };

    it("should fetch article by ID with populate parameter", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/1?populate=*");
      expect(result).toEqual(mockArticleResponse);
    });

    it("should handle string slug ID", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/test-slug") as any;
      const params = Promise.resolve({ id: "test-slug" });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/test-slug?populate=*");
      expect(response.status).toBe(200);
    });

    it("should decode URI components in ID parameter", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/test%20article") as any;
      const params = Promise.resolve({ id: "test article" });
      const response = await GET(request, { params });

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles/test article?populate=*");
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
    });

    it("should handle API client errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });

      await expect(GET(request, { params })).rejects.toThrow("Network error");
    });

    it("should return proper JSON response structure", async () => {
      mockApiClient.get.mockResolvedValue(mockArticleResponse);

      const request = new Request("http://localhost:3000/api/articles/1") as any;
      const params = Promise.resolve({ id: "1" });
      const response = await GET(request, { params });
      const result = await response.json();

      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("id");
      expect(result.data).toHaveProperty("title");
      expect(result.data).toHaveProperty("content");
    });
  });
});
