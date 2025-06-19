import { GET } from "../route";
import type { ArticlesStrapiResponse } from "@/types";

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

describe("Articles API Route", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/articles", () => {
    const mockArticlesResponse: ArticlesStrapiResponse = {
      data: [
        {
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
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    };

    it("should fetch articles without query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles?");
      expect(result).toEqual(mockArticlesResponse);
    });

    it("should handle query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?filters[title][$containsi]=test&pagination[page]=1"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?filters[title][$containsi]=test&pagination[page]=1"
      );
      expect(response.status).toBe(200);
    });

    it("should decode URI components in query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?filters[title][$containsi]=test%20article"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?filters[title][$containsi]=test+article"
      );
    });

    it("should handle empty results", async () => {
      const emptyResponse: ArticlesStrapiResponse = {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 0,
            total: 0,
          },
        },
      };

      mockApiClient.get.mockResolvedValue(emptyResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result.data).toEqual([]);
      expect(result.meta.pagination.total).toBe(0);
    });

    it("should handle API client errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));

      const request = new Request("http://localhost:3000/api/articles") as any;

      await expect(GET(request)).rejects.toThrow("Network error");
    });

    it("should return proper JSON response", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("meta");
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});
