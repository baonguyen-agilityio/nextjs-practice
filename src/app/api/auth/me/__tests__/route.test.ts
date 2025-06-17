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

jest.mock("@/constants/api", () => ({
  API_ENDPOINTS: {
    USER: "/users",
  },
}));

jest.mock("@/hocs/withAuth", () => ({
  withAuth: (handler: any) => (req: any) => handler(req, "Bearer mock-token"),
}));

import { apiClient } from "@/services/api";

describe("Auth Me API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

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

    it("should successfully retrieve user session", async () => {
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
      expect(response.status).toBe(200);
    });

    it("should handle valid JWT token", async () => {
      mockApiClient.get.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBeNull();
      expect(result.id).toBe(mockUserSession.id);
      expect(result.email).toBe(mockUserSession.email);
    });

    it("should handle expired token error", async () => {
      const expiredTokenResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Token has expired",
      };

      mockApiClient.get.mockResolvedValue(expiredTokenResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Token has expired");
      expect(result.id).toBeNull();
    });

    it("should handle invalid token error", async () => {
      const invalidTokenResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Invalid token",
      };

      mockApiClient.get.mockResolvedValue(invalidTokenResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Invalid token");
      expect(result.id).toBeNull();
    });

    it("should handle missing token", async () => {
      const noTokenResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Authorization token is required",
      };

      mockApiClient.get.mockResolvedValue(noTokenResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Authorization token is required");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockApiClient.get.mockRejectedValue(networkError);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      await expect(GET(request)).rejects.toThrow("Network connection failed");
    });

    it("should handle server errors", async () => {
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

    it("should include populate parameter in request", async () => {
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

    it("should handle malformed token", async () => {
      const malformedTokenResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Malformed token",
      };

      mockApiClient.get.mockResolvedValue(malformedTokenResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Malformed token");
    });

    it("should handle user not found error", async () => {
      const userNotFoundResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "User not found",
      };

      mockApiClient.get.mockResolvedValue(userNotFoundResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("User not found");
    });

    it("should handle different user roles", async () => {
      const adminUserResponse = {
        ...mockUserSession,
        role: "admin",
        error: null,
      };

      mockApiClient.get.mockResolvedValue(adminUserResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.role).toBe("admin");
      expect(result.error).toBeNull();
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

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      mockApiClient.get.mockRejectedValue(timeoutError);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      await expect(GET(request)).rejects.toThrow("Request timeout");
    });

    it("should handle rate limiting", async () => {
      const rateLimitResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Too many requests. Please try again later.",
      };

      mockApiClient.get.mockResolvedValue(rateLimitResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Too many requests. Please try again later.");
    });

    it("should handle empty token", async () => {
      const emptyTokenResponse = {
        id: null,
        username: null,
        email: null,
        role: null,
        token: null,
        error: "Token cannot be empty",
      };

      mockApiClient.get.mockResolvedValue(emptyTokenResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.error).toBe("Token cannot be empty");
    });

    it("should handle successful response with all user data", async () => {
      const fullUserResponse = {
        id: "user-456",
        username: "janedoe",
        email: "jane.doe@example.com",
        role: "authenticated",
        token: "new-jwt-token",
        profile: {
          firstName: "Jane",
          lastName: "Doe",
          avatar: "https://example.com/avatar.jpg",
        },
        error: null,
      };

      mockApiClient.get.mockResolvedValue(fullUserResponse);

      const request = new Request("http://localhost:3000/api/auth/me") as any;

      const response = await GET(request);
      const result = await response.json();

      expect(result.id).toBe("user-456");
      expect(result.username).toBe("janedoe");
      expect(result.email).toBe("jane.doe@example.com");
      expect(result.profile).toBeDefined();
      expect(result.error).toBeNull();
    });
  });
});
