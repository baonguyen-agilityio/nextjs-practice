import { login, logout } from "../auth";
import { apiClient } from "../api";
import { signOut } from "@/lib/auth/auth";

jest.mock("../api", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock("@/lib/auth/auth", () => ({
  signOut: jest.fn(),
}));

jest.mock("@/constants/api", () => ({
  API_ROUTE_ENDPOINT: {
    LOGIN: "/auth/local",
  },
  DOMAIN: "https://api.example.com",
}));

jest.mock("@/constants/message", () => ({
  EXCEPTION_ERROR_MESSAGE: {
    LOGIN: "Login failed unexpectedly",
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        jwt: "mock-jwt-token",
        user: {
          id: "user-123",
          username: "testuser",
          email: "test@example.com",
          role: "authenticated",
        },
        error: null,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await login(loginData);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: {
          identifier: "test@example.com",
          password: "password123",
        },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        user: {
          id: "user-123",
          token: "mock-jwt-token",
          username: "testuser",
          email: "test@example.com",
          role: "authenticated",
        },
        error: null,
      });
    });

    it("should handle login error from API", async () => {
      const loginData = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      const mockErrorResponse = {
        error: JSON.stringify({
          error: {
            message: "Invalid identifier or password",
          },
        }),
        jwt: null,
        user: null,
      };

      mockApiClient.post.mockResolvedValue(mockErrorResponse);

      const result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: "Invalid identifier or password",
      });
    });

    it("should handle missing user in response", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        jwt: "mock-jwt-token",
        user: null,
        error: JSON.stringify({
          error: {
            message: "User not found",
          },
        }),
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: "User not found",
      });
    });

    it("should handle network errors", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      mockApiClient.post.mockRejectedValue(new Error("Network error"));

      const result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: "Network error",
      });
    });

    it("should handle unexpected errors", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      mockApiClient.post.mockRejectedValue("Unexpected error");

      const result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: "Login failed unexpectedly",
      });
    });

    it("should handle partial user data", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        jwt: "mock-jwt-token",
        user: {
          id: undefined,
          username: undefined,
          email: undefined,
          role: undefined,
        },
        error: null,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await login(loginData);

      expect(result).toEqual({
        user: {
          id: "",
          token: "mock-jwt-token",
          username: "",
          email: "",
          role: "",
        },
        error: null,
      });
    });

    it("should handle malformed error JSON", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        jwt: null,
        user: null,
        error: "invalid json {",
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: expect.stringContaining("Unexpected token"),
      });
    });

    it("should handle empty credentials", async () => {
      const loginData = {
        email: "",
        password: "",
      };

      const mockResponse = {
        jwt: "mock-jwt-token",
        user: {
          id: "user-123",
          username: "testuser",
          email: "",
          role: "authenticated",
        },
        error: null,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await login(loginData);

      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/local", {
        body: {
          identifier: "",
          password: "",
        },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual({
        user: {
          id: "user-123",
          token: "mock-jwt-token",
          username: "testuser",
          email: "",
          role: "authenticated",
        },
        error: null,
      });
    });
  });

  describe("logout", () => {
    it("should call signOut function", async () => {
      mockSignOut.mockResolvedValue(undefined);

      await logout();

      expect(mockSignOut).toHaveBeenCalledWith();
    });

    it("should handle signOut errors", async () => {
      mockSignOut.mockRejectedValue(new Error("Logout failed"));

      await expect(logout()).rejects.toThrow("Logout failed");
      expect(mockSignOut).toHaveBeenCalledWith();
    });
  });
});
