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
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    it("should handle successful login", async () => {
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

    it("should handle login errors", async () => {
      const mockErrorResponse = {
        error: JSON.stringify({
          error: { message: "Invalid credentials" },
        }),
        jwt: null,
        user: null,
      };

      mockApiClient.post.mockResolvedValue(mockErrorResponse);
      let result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: "Invalid credentials",
      });

      mockApiClient.post.mockRejectedValue(new Error("Network error"));
      result = await login(loginData);

      expect(result).toEqual({
        user: null,
        error: "Network error",
      });
    });
  });

  describe("logout", () => {
    it("should handle logout", async () => {
      mockSignOut.mockResolvedValue(undefined);

      await logout();

      expect(mockSignOut).toHaveBeenCalledWith();

      mockSignOut.mockRejectedValue(new Error("Logout failed"));
      await expect(logout()).rejects.toThrow("Logout failed");
    });
  });
});
