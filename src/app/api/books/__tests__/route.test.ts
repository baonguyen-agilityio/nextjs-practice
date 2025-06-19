import { apiClient } from "@/services/api";
import { GET, POST } from "../route";

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
    post: jest.fn(),
  },
}));

describe("Books API Routes", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/books", () => {
    const mockBooksResponse = {
      data: [
        {
          id: "book-1",
          title: "JavaScript Guide",
          price: 2999,
          image: { url: "book1.jpg" },
        },
      ],
      meta: { total: 1 },
    };

    it("should fetch books successfully", async () => {
      mockApiClient.get.mockResolvedValue(mockBooksResponse);

      const request = new Request("http://localhost:3000/api/books") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/books?");
      expect(result).toEqual(mockBooksResponse);
    });

    it("should handle query parameters", async () => {
      mockApiClient.get.mockResolvedValue(mockBooksResponse);

      const request = new Request(
        "http://localhost:3000/api/books?search=javascript&page=2"
      ) as any;
      await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith("/books?search=javascript&page=2");
    });

    it("should handle API client errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));

      const request = new Request("http://localhost:3000/api/books") as any;

      await expect(GET(request)).rejects.toThrow("Network error");
    });

    it("should return API response directly", async () => {
      const errorResponse = { error: "Books not found" };
      mockApiClient.get.mockResolvedValue(errorResponse);

      const request = new Request("http://localhost:3000/api/books") as any;
      const response = await GET(request);
      const result = await response.json();

      expect(result).toEqual(errorResponse);
    });
  });

  describe("POST /api/books", () => {
    const mockBookData = {
      data: {
        title: "New Book",
        price: 1999,
        description: "A great book",
        category: "fiction",
      },
    };

    const mockCreateResponse = {
      data: {
        id: "book-new",
        ...mockBookData.data,
      },
    };

    it("should create a book successfully", async () => {
      mockApiClient.post.mockResolvedValue(mockCreateResponse);

      const request = new Request("http://localhost:3000/api/books", {
        method: "POST",
        body: JSON.stringify(mockBookData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.post).toHaveBeenCalledWith("/books", {
        body: mockBookData,
      });
      expect(result).toEqual(mockCreateResponse);
    });

    it("should handle API client errors", async () => {
      mockApiClient.post.mockRejectedValue(new Error("Creation failed"));

      const request = new Request("http://localhost:3000/api/books", {
        method: "POST",
        body: JSON.stringify(mockBookData),
      }) as any;

      await expect(POST(request)).rejects.toThrow("Creation failed");
    });

    it("should return API error responses", async () => {
      const errorResponse = {
        error: "Validation failed",
        details: ["Title is required"],
      };
      mockApiClient.post.mockResolvedValue(errorResponse);

      const request = new Request("http://localhost:3000/api/books", {
        method: "POST",
        body: JSON.stringify(mockBookData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result).toEqual(errorResponse);
    });
  });
});
