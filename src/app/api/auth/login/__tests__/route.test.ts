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

jest.mock("@/constants/api", () => ({
  API_ENDPOINTS: {
    AUTH: "/auth/local",
  },
}));

import { apiClient } from "@/services/api";

describe("Login API Route", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    const validLoginData: LoginFormData = {
      email: "john.doe@example.com",
      password: "securePassword123",
    };

    const mockUserSession: UserSession = {
      id: "user-123",
      username: "johndoe",
      email: "john.doe@example.com",
      role: "authenticated",
      token: "jwt-token-here",
    };

    const mockSuccessResponse: AuthResponse = {
      jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      user: mockUserSession,
      error: null,
    };

    it("should successfully authenticate with valid credentials", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
        headers: { "Content-Type": "application/json" },
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: validLoginData,
      });
      expect(result).toEqual(mockSuccessResponse);
      expect(response.status).toBe(200);
    });

    it("should handle login with email and password", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const loginData = {
        email: "user@test.com",
        password: "password123",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: loginData,
      });
      expect(result.jwt).toBe(mockSuccessResponse.jwt);
      expect(result.user).toEqual(mockSuccessResponse.user);
      expect(result.error).toBeNull();
    });

    it("should handle invalid credentials error", async () => {
      const errorResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Invalid email or password",
      };

      mockApiClient.post.mockResolvedValue(errorResponse);

      const invalidLoginData = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(invalidLoginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.jwt).toBe("");
      expect(result.user).toBeNull();
      expect(result.error).toBe("Invalid email or password");
      expect(response.status).toBe(200);
    });

    it("should handle missing email field", async () => {
      const errorResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Email is required",
      };

      mockApiClient.post.mockResolvedValue(errorResponse);

      const incompleteData = {
        password: "password123",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(incompleteData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Email is required");
      expect(result.user).toBeNull();
    });

    it("should handle missing password field", async () => {
      const errorResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Password is required",
      };

      mockApiClient.post.mockResolvedValue(errorResponse);

      const incompleteData = {
        email: "user@example.com",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(incompleteData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Password is required");
      expect(result.user).toBeNull();
    });

    it("should handle empty request body", async () => {
      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({}),
      }) as any;

      const errorResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Email and password are required",
      };

      mockApiClient.post.mockResolvedValue(errorResponse);

      const response = await POST(request);
      const result = await response.json();

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: {},
      });
      expect(result.error).toBeTruthy();
    });

    it("should handle malformed JSON in request body", async () => {
      const request = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as any;

      await expect(POST(request)).rejects.toThrow("Invalid JSON");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network connection failed");
      mockApiClient.post.mockRejectedValue(networkError);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      await expect(POST(request)).rejects.toThrow("Network connection failed");
    });

    it("should handle server errors", async () => {
      const serverErrorResponse = {
        error: {
          status: 500,
          name: "InternalServerError",
          message: "Internal server error",
        },
      };

      mockApiClient.post.mockResolvedValue(serverErrorResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result).toEqual(serverErrorResponse);
    });

    it("should handle user account locked error", async () => {
      const lockedAccountResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Account is locked due to too many failed login attempts",
      };

      mockApiClient.post.mockResolvedValue(lockedAccountResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Account is locked due to too many failed login attempts");
      expect(result.user).toBeNull();
    });

    it("should handle user not found error", async () => {
      const userNotFoundResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "User not found",
      };

      mockApiClient.post.mockResolvedValue(userNotFoundResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "password123",
        }),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("User not found");
      expect(result.user).toBeNull();
    });

    it("should validate email format", async () => {
      const invalidEmailResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Invalid email format",
      };

      mockApiClient.post.mockResolvedValue(invalidEmailResponse);

      const invalidEmailData = {
        email: "not-an-email",
        password: "password123",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(invalidEmailData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Invalid email format");
    });

    it("should handle special characters in password", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const specialPasswordData = {
        email: "user@example.com",
        password: "P@ssw0rd!#$%^&*()",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(specialPasswordData),
      }) as any;

      const response = await POST(request);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: specialPasswordData,
      });
      expect(response.status).toBe(200);
    });

    it("should handle unicode characters in email", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const unicodeEmailData = {
        email: "tëst@éxample.com",
        password: "password123",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(unicodeEmailData),
      }) as any;

      const response = await POST(request);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: unicodeEmailData,
      });
      expect(response.status).toBe(200);
    });

    it("should return proper response structure", async () => {
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

      if (result.user) {
        expect(result.user).toHaveProperty("id");
        expect(result.user).toHaveProperty("username");
        expect(result.user).toHaveProperty("email");
        expect(result.user).toHaveProperty("role");
        expect(result.user).toHaveProperty("token");
      }
    });

    it("should handle timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      timeoutError.name = "TimeoutError";
      mockApiClient.post.mockRejectedValue(timeoutError);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      await expect(POST(request)).rejects.toThrow("Request timeout");
    });

    it("should handle rate limiting error", async () => {
      const rateLimitResponse: AuthResponse = {
        jwt: "",
        user: null,
        error: "Too many login attempts. Please try again later.",
      };

      mockApiClient.post.mockResolvedValue(rateLimitResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe("Too many login attempts. Please try again later.");
      expect(result.user).toBeNull();
    });

    it("should preserve response headers", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validLoginData),
      }) as any;

      const response = await POST(request);

      expect(response.headers.get("content-type")).toBe("application/json");
    });

    it("should handle very long passwords", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const longPasswordData = {
        email: "user@example.com",
        password: "a".repeat(1000),
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(longPasswordData),
      }) as any;

      const response = await POST(request);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: longPasswordData,
      });
      expect(response.status).toBe(200);
    });

    it("should handle case-sensitive email", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const caseEmailData = {
        email: "User@EXAMPLE.COM",
        password: "password123",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(caseEmailData),
      }) as any;

      const response = await POST(request);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: caseEmailData,
      });
      expect(response.status).toBe(200);
    });

    it("should handle additional fields in request body", async () => {
      mockApiClient.post.mockResolvedValue(mockSuccessResponse);

      const dataWithExtraFields = {
        email: "user@example.com",
        password: "password123",
        rememberMe: true,
        deviceId: "device-123",
        clientVersion: "1.0.0",
      };

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(dataWithExtraFields),
      }) as any;

      const response = await POST(request);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: dataWithExtraFields,
      });
      expect(response.status).toBe(200);
    });

    it("should handle Strapi validation errors", async () => {
      const validationErrorResponse = {
        error: {
          status: 400,
          name: "ValidationError",
          message: "Email field is required",
          details: {
            errors: [
              {
                path: ["email"],
                message: "Email is a required field",
                name: "ValidationError",
              },
            ],
          },
        },
      };

      mockApiClient.post.mockResolvedValue(validationErrorResponse);

      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password: "password123" }),
      }) as any;

      const response = await POST(request);
      const result = await response.json();

      expect(result).toEqual(validationErrorResponse);
    });
  });
});
