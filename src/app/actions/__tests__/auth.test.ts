jest.mock("next-auth", () => {
  class MockAuthError extends Error {
    type: string = "";

    constructor(message: string) {
      super(message);
      this.name = "AuthError";
    }
  }

  return {
    AuthError: MockAuthError,
  };
});

jest.mock("@/lib/auth/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

import { authenticate, logout } from "../auth";
import { signIn, signOut } from "@/lib/auth/auth";
import { AuthError } from "next-auth";

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe("Auth Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should successfully authenticate with valid credentials", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      mockSignIn.mockResolvedValueOnce(undefined);

      const result = await authenticate(undefined, formData);

      expect(mockSignIn).toHaveBeenCalledWith("credentials", formData);
      expect(result).toBeUndefined();
    });

    it("should return error message for CredentialsSignin error", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "wrongpassword");

      const authError = new AuthError("Invalid credentials");
      authError.type = "CredentialsSignin";
      mockSignIn.mockRejectedValueOnce(authError);

      const result = await authenticate(undefined, formData);

      expect(mockSignIn).toHaveBeenCalledWith("credentials", formData);
      expect(result).toBe("Invalid identifier or password");
    });

    it("should return generic error message for other AuthError types", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const authError = new AuthError("Some other error");
      authError.type = "AccessDenied";
      mockSignIn.mockRejectedValueOnce(authError);

      const result = await authenticate(undefined, formData);

      expect(mockSignIn).toHaveBeenCalledWith("credentials", formData);
      expect(result).toBe("Something went wrong.");
    });

    it("should throw error for non-AuthError exceptions", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const networkError = new Error("Network error");
      mockSignIn.mockRejectedValueOnce(networkError);

      await expect(authenticate(undefined, formData)).rejects.toThrow("Network error");
      expect(mockSignIn).toHaveBeenCalledWith("credentials", formData);
    });

    it("should handle empty form data", async () => {
      const formData = new FormData();
      mockSignIn.mockResolvedValueOnce(undefined);

      const result = await authenticate(undefined, formData);

      expect(mockSignIn).toHaveBeenCalledWith("credentials", formData);
      expect(result).toBeUndefined();
    });

    it("should handle previous state parameter", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      mockSignIn.mockResolvedValueOnce(undefined);

      const result = await authenticate("previous error", formData);

      expect(mockSignIn).toHaveBeenCalledWith("credentials", formData);
      expect(result).toBeUndefined();
    });
  });

  describe("logout", () => {
    it("should successfully log out user", async () => {
      mockSignOut.mockResolvedValueOnce(undefined);

      await logout();

      expect(mockSignOut).toHaveBeenCalledWith();
    });

    it("should handle logout errors", async () => {
      const logoutError = new Error("Logout failed");
      mockSignOut.mockRejectedValueOnce(logoutError);

      await expect(logout()).rejects.toThrow("Logout failed");
      expect(mockSignOut).toHaveBeenCalledWith();
    });
  });
});
