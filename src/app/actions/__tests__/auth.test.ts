jest.mock("next-auth", () => ({
  AuthError: class extends Error {
    type: string = "";
    constructor(message: string) {
      super(message);
      this.name = "AuthError";
    }
  },
}));

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

    it("should return error message for authentication failure", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "wrongpassword");

      const authError = new AuthError("Invalid credentials");
      authError.type = "CredentialsSignin";
      mockSignIn.mockRejectedValueOnce(authError);

      const result = await authenticate(undefined, formData);

      expect(result).toBe("Invalid identifier or password");
    });

    it("should handle other authentication errors", async () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");

      const authError = new AuthError("Some other error");
      authError.type = "AccessDenied";
      mockSignIn.mockRejectedValueOnce(authError);

      const result = await authenticate(undefined, formData);

      expect(result).toBe("Something went wrong.");
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
    });
  });
});
