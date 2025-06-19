import { POST } from "../route";
import type { AuthResponse, LoginFormData, UserSession } from "@/types";

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
    post: jest.fn(),
  },
}));

import { apiClient } from "@/services/api";

describe("Login API Route", () => {
  const mockApiClient = apiClient as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    const validLoginData: LoginFormData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUserSession: UserSession = {
      id: "user-123",
      username: "testuser",
      email: "test@example.com",
      role: "authenticated",
      token: "jwt-token",
    };

    const mockSuccessResponse: AuthResponse = {
      jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      user: mockUserSession,
      error: null,
    };

    it("should authenticate with valid credentials", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: validLoginData,
      });
      expect(result).toEqual(mockSuccessResponse);
    });

    it("should handle invalid credentials", async () => {
      const errorResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Invalid email or password",
      };

      mockApiClient.post.mockResolvedValue(errorResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "wrong@example.com",
          password: "wrongpassword",
        }),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.jwt).toBe("");
      expect(result.user).toBeNull();
      expect(result.error).toBe("Invalid email or password");
    });

    it("should handle empty request body", async () => {
      const errorResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Email and password are required",
      };

      mockApiClient.post.mockResolvedValue(errorResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({}),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: {},
      });
      expect(result.error).toBeTruthy();
    });

    it("should handle malformed JSON", async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as any;

      await expect(POST(request)).rejects.toThrow("Invalid JSON");
    });

    it("should handle API client errors", async () => {
      mockApiClient.post.mockRejectedValue(new Error("Network error"));

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      await expect(POST(request)).rejects.toThrow("Network error");
    });

    it("should return proper JSON response structure", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result).toHaveProperty("jwt");
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("error");
    });
  });
});
