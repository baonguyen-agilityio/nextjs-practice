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

jest.mock("@/constants/api", () => ({
  API_ENDPOINTS: {
    ARTICLES: "/articles",
  },
}));

import { apiClient } from "@/services/api";

describe("Articles API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/articles", () => {
    const mockArticlesResponse: ArticlesStrapiResponse = {
      data: [
        {
          id: "1",
          slug: "javascript-guide",
          title: "JavaScript Complete Guide",
          description: "A comprehensive guide to JavaScript",
          content: "JavaScript is a versatile programming language...",
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
        },
        {
          id: "2",
          slug: "react-fundamentals",
          title: "React Fundamentals",
          description: "Learn React from the ground up",
          content: "React is a JavaScript library for building user interfaces...",
          image: {
            url: "/uploads/react-fundamentals.jpg",
          },
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          publishedAt: "2024-01-02T00:00:00.000Z",
          author: {
            name: "Jane Smith",
          },
          documentId: "article-doc-2",
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 2,
        },
      },
    };

    it("should successfully fetch articles without query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles?");
      expect(result).toEqual(mockArticlesResponse);
      expect(response.status).toBe(200);
    });

    it("should handle search query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?filters[title][$containsi]=javascript"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?filters[title][$containsi]=javascript"
      );
      expect(response.status).toBe(200);
    });

    it("should handle pagination parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?pagination[page]=2&pagination[pageSize]=10"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?pagination[page]=2&pagination[pageSize]=10"
      );
      expect(response.status).toBe(200);
    });

    it("should handle sorting parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?sort[0]=createdAt:desc"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles?sort[0]=createdAt:desc");
      expect(response.status).toBe(200);
    });

    it("should handle populate parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request("http://localhost:3000/api/articles?populate=*") as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles?populate=*");
      expect(response.status).toBe(200);
    });

    it("should handle multiple query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?filters[title][$containsi]=react&pagination[page]=1&sort[0]=createdAt:desc&populate=*"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?filters[title][$containsi]=react&pagination[page]=1&sort[0]=createdAt:desc&populate=*"
      );
      expect(response.status).toBe(200);
    });

    it("should decode URI components in query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?filters[title][$containsi]=java%20script"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?filters[title][$containsi]=java+script"
      );
      expect(response.status).toBe(200);
    });

    it("should handle empty search results", async () => {
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

      const request = new Request(
        "http://localhost:3000/api/articles?filters[title][$containsi]=nonexistent"
      ) as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result.data).toEqual([]);
      expect(result.meta.pagination.total).toBe(0);
      expect(response.status).toBe(200);
    });

    it("should handle API client errors", async () => {
      const error = new Error("Network error");
      mockApiClient.get.mockRejectedValue(error);

      const request = new Request("http://localhost:3000/api/articles") as any;

      await expect(GET(request)).rejects.toThrow("Network error");

      expect(mockApiClient.get).toHaveBeenCalledWith("/articles?");
    });

    it("should handle Strapi API errors", async () => {
      const errorResponse = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Internal server error",
        },
      };

      mockApiClient.get.mockResolvedValue(errorResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result).toEqual(errorResponse);
      expect(response.status).toBe(200);
    });

    it("should preserve complex filter structures", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const complexQuery =
        "filters[$and][0][title][$containsi]=javascript&filters[$and][1][author][name][$eq]=John";
      const request = new Request(`http://localhost:3000/api/articles?${complexQuery}`) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/articles?${complexQuery}`);
      expect(response.status).toBe(200);
    });

    it("should handle fields selection", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request(
        "http://localhost:3000/api/articles?fields[0]=title&fields[1]=description"
      ) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?fields[0]=title&fields[1]=description"
      );
      expect(response.status).toBe(200);
    });

    it("should return proper response structure", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("meta");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.meta).toHaveProperty("pagination");

      if (result.data.length > 0) {
        const article = result.data[0];
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("description");
        expect(article).toHaveProperty("content");
        expect(article).toHaveProperty("image");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("createdAt");
        expect(article).toHaveProperty("publishedAt");
      }
    });

    it("should handle special characters in query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const specialCharsQuery = "filters[title][$containsi]=C%2B%2B%20Programming"; // C++ Programming
      const request = new Request(`http://localhost:3000/api/articles?${specialCharsQuery}`) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/articles?filters[title][$containsi]=C+++Programming"
      );
      expect(response.status).toBe(200);
    });

    it("should handle date range filters", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const dateQuery =
        "filters[publishedAt][$gte]=2024-01-01&filters[publishedAt][$lte]=2024-12-31";
      const request = new Request(`http://localhost:3000/api/articles?${dateQuery}`) as any;
      const response = await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(`/articles?${dateQuery}`);
      expect(response.status).toBe(200);
    });

    it("should preserve response headers", async () => {
      mockApiClient.get.mockResolvedValue(mockArticlesResponse);

      const request = new Request("http://localhost:3000/api/articles") as any;
      const response = await GET(request);

      expect(response.headers.get("content-type")).toBe("application/json");
    });
  });
});
