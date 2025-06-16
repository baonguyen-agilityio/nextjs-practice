import { login } from "@/services/auth";

jest.mock("@/services/auth", () => ({
  login: jest.fn(),
}));

jest.mock("next-auth", () => {
  return jest.fn(() => ({
    handlers: {},
    signIn: jest.fn(),
    signOut: jest.fn(),
    auth: jest.fn(),
  }));
});

jest.mock("next-auth/providers/credentials", () => {
  return jest.fn((config) => config);
});

import { authorizeUser } from "../auth";

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

const mockLogin = login as jest.MockedFunction<typeof login>;

describe("Auth Configuration - Authorize Function", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_STRAPI_URL: "https://api.example.com",
      NODE_ENV: "test",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("successful authorization", () => {
    it("should successfully authorize valid credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUserData = {
        id: "user-123",
        username: "testuser",
        email: "test@example.com",
        role: { type: "admin" },
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "user-123",
          token: "jwt-token",
          username: "testuser",
          email: "test@example.com",
          role: "admin",
        },
        error: null,
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      } as any);

      const result = await authorizeUser(credentials);

      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/api/users/me?populate=role", {
        headers: {
          Authorization: "Bearer jwt-token",
        },
      });
      expect(result).toEqual({
        id: "user-123",
        email: "test@example.com",
        name: "testuser",
        token: "jwt-token",
        role: "admin",
      });
    });

    it("should handle user data with missing role", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUserData = {
        id: "user-123",
        username: "testuser",
        email: "test@example.com",
        role: null,
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "user-123",
          token: "jwt-token",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        error: null,
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      } as any);

      const result = await authorizeUser(credentials);

      expect(result).toEqual({
        id: "user-123",
        email: "test@example.com",
        name: "testuser",
        token: "jwt-token",
        role: "user",
      });
    });
  });

  describe("validation errors", () => {
    it("should return null for invalid email format", async () => {
      const credentials = {
        email: "invalid-email",
        password: "password123",
      };

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "development",
        configurable: true,
      });

      const result = await authorizeUser(credentials);

      expect(mockLogin).not.toHaveBeenCalled();
      expect(result).toBe(null);
      expect(consoleSpy).toHaveBeenCalledWith("Invalid credentials:", expect.any(Object));

      consoleSpy.mockRestore();
    });

    it("should call login service even with empty password", async () => {
      const credentials = {
        email: "test@example.com",
        password: "",
      };

      mockLogin.mockResolvedValue({
        user: null,
        error: "Invalid credentials",
      });

      const result = await authorizeUser(credentials);

      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "",
      });
      expect(result).toBe(null);
    });

    it("should not log validation errors in production", async () => {
      const credentials = {
        email: "invalid-email",
        password: "",
      };

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        configurable: true,
      });

      const result = await authorizeUser(credentials);

      expect(result).toBe(null);
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("login service errors", () => {
    it("should return null when login service returns error", async () => {
      const credentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      mockLogin.mockResolvedValue({
        user: null,
        error: "Invalid credentials",
      });

      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "development",
        configurable: true,
      });

      const result = await authorizeUser(credentials);

      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "wrongpassword",
      });
      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toBe(null);
      expect(consoleSpy).toHaveBeenCalledWith("Login failed:", "Invalid credentials");

      consoleSpy.mockRestore();
    });

    it("should return null when login service returns no user", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockLogin.mockResolvedValue({
        user: null,
        error: null,
      });

      const result = await authorizeUser(credentials);

      expect(result).toBe(null);
    });

    it("should handle login service exceptions", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockLogin.mockRejectedValue(new Error("Service error"));

      const result = await authorizeUser(credentials);

      expect(result).toBe(null);
    });
  });

  describe("fetch errors", () => {
    it("should return null when user data fetch fails", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "user-123",
          token: "jwt-token",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        error: null,
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      } as any);

      const result = await authorizeUser(credentials);

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/api/users/me?populate=role", {
        headers: {
          Authorization: "Bearer jwt-token",
        },
      });
      expect(result).toBe(null);
    });

    it("should handle fetch network errors", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "user-123",
          token: "jwt-token",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        error: null,
      });

      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await authorizeUser(credentials);

      expect(result).toBe(null);
    });

    it("should handle missing environment variable", async () => {
      delete process.env.NEXT_PUBLIC_STRAPI_URL;

      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "user-123",
          token: "jwt-token",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
        error: null,
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as any);

      const result = await authorizeUser(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        "undefined/api/users/me?populate=role",
        expect.any(Object)
      );
      expect(result).toBe(null);
    });
  });

  describe("data transformation", () => {
    it("should properly transform successful user data", async () => {
      const credentials = {
        email: "admin@example.com",
        password: "admin123",
      };

      const mockUserData = {
        id: "admin-456",
        username: "adminuser",
        email: "admin@example.com",
        role: { type: "admin" },
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "admin-456",
          token: "admin-jwt-token",
          username: "adminuser",
          email: "admin@example.com",
          role: "admin",
        },
        error: null,
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      } as any);

      const result = await authorizeUser(credentials);

      expect(result).toEqual({
        id: "admin-456",
        email: "admin@example.com",
        name: "adminuser",
        token: "admin-jwt-token",
        role: "admin",
      });
    });

    it("should handle user data with undefined role", async () => {
      const credentials = {
        email: "user@example.com",
        password: "user123",
      };

      const mockUserData = {
        id: "user-789",
        username: "regularuser",
        email: "user@example.com",
      };

      mockLogin.mockResolvedValue({
        user: {
          id: "user-789",
          token: "user-jwt-token",
          username: "regularuser",
          email: "user@example.com",
          role: "user",
        },
        error: null,
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockUserData),
      } as any);

      const result = await authorizeUser(credentials);

      expect(result).toEqual({
        id: "user-789",
        email: "user@example.com",
        name: "regularuser",
        token: "user-jwt-token",
        role: "user",
      });
    });
  });
});
