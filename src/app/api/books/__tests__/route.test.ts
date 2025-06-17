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

jest.mock("@/constants/api", () => ({
  API_ENDPOINTS: {
    BOOKS: "/books",
  },
}));

describe("Books API Routes", () => {
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      url: "http://localhost:3000/api/books",
      json: jest.fn(),
    };
  });

  describe("GET /api/books", () => {
    it("should fetch books with query parameters", async () => {
      const mockBooksResponse = {
        data: [
          {
            id: "book-1",
            title: "JavaScript Guide",
            price: 2999,
            image: { url: "book1.jpg" },
          },
          {
            id: "book-2",
            title: "React Handbook",
            price: 3999,
            image: { url: "book2.jpg" },
          },
        ],
        meta: { total: 2 },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockBooksResponse);

      const response = await GET(mockRequest);
      const result = await response.json();

      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("/books"));

      expect(result).toEqual(mockBooksResponse);
    });

    it("should handle search parameters", async () => {
      const requestWithSearch = {
        url: "http://localhost:3000/api/books?search=javascript&category=programming",
        json: jest.fn(),
      };

      const mockBooksResponse = { data: [], meta: { total: 0 } };
      (apiClient.get as jest.Mock).mockResolvedValue(mockBooksResponse);

      await GET(requestWithSearch as any);

      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("search=javascript"));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("category=programming"));
    });

    it("should handle pagination parameters", async () => {
      const requestWithPagination = {
        url: "http://localhost:3000/api/books?page=2&pageSize=10",
        json: jest.fn(),
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: [], meta: { total: 0 } });

      await GET(requestWithPagination as any);

      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("page=2"));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("pageSize=10"));
    });

    it("should pass through API client response", async () => {
      const mockError = { error: "Books not found" };
      (apiClient.get as jest.Mock).mockResolvedValue(mockError);

      const response = await GET(mockRequest);
      const result = await response.json();

      expect(result).toEqual(mockError);
    });
  });

  describe("POST /api/books", () => {
    const mockBookData = {
      data: {
        title: "New Book",
        price: 1999,
        description: "A great book",
        language: "English",
        category: "fiction",
      },
    };

    beforeEach(() => {
      mockRequest.json = jest.fn().mockResolvedValue(mockBookData);
    });

    it("should create a new book", async () => {
      const mockCreateResponse = {
        data: {
          id: "book-new",
          ...mockBookData.data,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockCreateResponse);

      const response = await POST(mockRequest);
      const result = await response.json();

      expect(mockRequest.json).toHaveBeenCalled();
      expect(apiClient.post).toHaveBeenCalledWith("/books", {
        body: mockBookData,
      });

      expect(result).toEqual(mockCreateResponse);
    });

    it("should handle book creation with different data", async () => {
      const customBookData = {
        data: {
          title: "Advanced React",
          price: 4999,
          description: "Learn advanced React patterns",
          language: "English",
          category: "programming",
        },
      };

      const requestWithCustomData = {
        url: "http://localhost:3000/api/books",
        json: jest.fn().mockResolvedValue(customBookData),
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: customBookData.data });

      await POST(requestWithCustomData as any);

      expect(apiClient.post).toHaveBeenCalledWith("/books", {
        body: customBookData,
      });
    });

    it("should handle POST request errors", async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error("Creation failed"));

      try {
        await POST(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it("should pass through API client errors", async () => {
      const mockError = {
        error: "Validation failed",
        details: ["Title is required"],
      };
      (apiClient.post as jest.Mock).mockResolvedValue(mockError);

      const response = await POST(mockRequest);
      const result = await response.json();

      expect(result).toEqual(mockError);
    });
  });
});
