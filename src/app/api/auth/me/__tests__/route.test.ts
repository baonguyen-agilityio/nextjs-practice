import { GET } from "../route";
import type { UserSession } from "@/types/user";

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
  },
}));

jest.mock("@/hocs/withAuth", () => ({
  withAuth: (handler: any) => (req: any) => handler(req, "Bearer mock-token"),
}));

import { apiClient } from "@/services/api";

describe("Auth Me API Route", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/auth/me", () => {
    const mockUserSession: UserSession = {
      id: "user-123",
      username: "johndoe",
      email: "john.doe@example.com",
      role: "authenticated",
      token: "jwt-token-here",
    };

    const mockSuccessResponse = {
      ...mockUserSession,
      error: null,
    };

    it("should retrieve user session successfully", async () => {
      mockApiClient.get.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(mockApiClient.get).toHaveBeenCalledWith("/users/me?populate=*", {
        headers: {
          Authorization: "Bearer mock-token",
        },
      });
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle authentication errors", async () => {
      const errorResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Invalid token",
      };

      mockApiClient.get.mockResolvedValue(errorResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Invalid token");
      expect(result.id).toBeNull();
    });

    it("should handle API client errors", async () => {
      mockApiClient.get.mockRejectedValue(new Error("Network error"));

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      await expect(GET(request)).rejects.toThrow("Network error");
    });

    it("should include proper request headers and endpoint", async () => {
      mockApiClient.get.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      await GET(request);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/users/me?populate=*",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer mock-token",
          },
        })
      );
    });

    it("should return proper response structure", async () => {
      mockApiClient.get.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("username");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("role");
      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("error");
    });

    it("should handle server error responses", async () => {
      const serverErrorResponse = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Internal server error",
        },
      };

      mockApiClient.get.mockResolvedValue(serverErrorResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result).toEqual(serverErrorResponse);
    });
  });
});
