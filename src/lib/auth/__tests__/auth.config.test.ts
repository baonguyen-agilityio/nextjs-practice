import { authConfig } from "../auth.config";

const mockRedirect = jest.fn();
global.Response = {
  redirect: mockRedirect,
} as any;

describe("Auth Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Configuration Structure", () => {
    it("should have correct configuration properties", () => {
      expect(authConfig).toHaveProperty("trustHost", true);
      expect(authConfig).toHaveProperty("callbacks");
      expect(authConfig).toHaveProperty("pages");
      expect(authConfig).toHaveProperty("providers");
      expect(authConfig.pages).toEqual({ signIn: "/login" });
      expect(authConfig.providers).toEqual([]);
    });
  });

  describe("JWT Callback", () => {
    it("should assign user properties to token when token exists", async () => {
      const mockToken = { sub: "user-123" };
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      };

      const result = await authConfig.callbacks.jwt({ token: mockToken, user: mockUser } as any);

      expect(result).toEqual({
        sub: "user-123",
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("should return token when no user provided", async () => {
      const mockToken = { sub: "user-123", email: "existing@example.com" };

      const result = await authConfig.callbacks.jwt({ token: mockToken } as any);

      expect(result).toEqual(mockToken);
    });
  });

  describe("Session Callback", () => {
    it("should assign token properties to session user", async () => {
      const mockSession = {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
        expires: "2024-12-31",
      };
      const mockToken = {
        sub: "user-123",
        id: "user-123",
        role: "admin",
        token: "jwt-token",
      };

      const result = await authConfig.callbacks.session({
        session: mockSession,
        token: mockToken,
      } as any);

      expect(result.user).toEqual(
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          sub: "user-123",
          id: "user-123",
          role: "admin",
          token: "jwt-token",
        })
      );
    });
  });

  describe("Authorized Callback", () => {
    it("should redirect when logged in user visits login page", () => {
      const mockUrl = new URL("http://localhost:3000/login");
      const params = {
        auth: { user: { id: "user-123" } },
        request: { nextUrl: mockUrl },
      };

      authConfig.callbacks.authorized(params as any);

      expect(mockRedirect).toHaveBeenCalled();
    });

    it("should allow access for other cases", () => {
      const mockUrl = new URL("http://localhost:3000/dashboard");
      const params = {
        auth: { user: { id: "user-123" } },
        request: { nextUrl: mockUrl },
      };

      const result = authConfig.callbacks.authorized(params as any);

      expect(result).toBe(true);
    });

    it("should allow access when not logged in", () => {
      const mockUrl = new URL("http://localhost:3000/home");
      const params = {
        auth: null,
        request: { nextUrl: mockUrl },
      };

      const result = authConfig.callbacks.authorized(params as any);

      expect(result).toBe(true);
    });
  });
});
