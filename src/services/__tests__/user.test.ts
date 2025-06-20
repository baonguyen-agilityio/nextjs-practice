import { getUser } from "../user";
import { apiClient } from "../api";

jest.mock("../api", () => ({
  apiClient: {
    apiClientSession: jest.fn(),
  },
}));

jest.mock("@/constants", () => ({
  TAGS: {
    USER: "user",
  },
}));

jest.mock("@/constants/api", () => ({
  API_ROUTE_ENDPOINT: {
    USER: "/api/users/me",
  },
  DOMAIN: "https://api.example.com",
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getUser", () => {
    it("should fetch user data successfully", async () => {
      const mockUserData = {
        id: "user-123",
        email: "test@example.com",
        username: "testuser",
        role: "authenticated",
        token: "user-token",
      };

      const mockApiClientSession = {
        get: jest.fn().mockResolvedValue(mockUserData),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const result = await getUser();

      expect(mockApiClient.apiClientSession).toHaveBeenCalled();
      expect(mockApiClientSession.get).toHaveBeenCalledWith("/api/users/me", {
        next: {
          revalidate: 3600,
          tags: ["user"],
        },
        baseUrl: "https://api.example.com",
      });

      expect(result).toEqual(mockUserData);
    });

    it("should handle various response formats", async () => {
      const mockApiClientSession = {
        get: jest.fn(),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);

      const partialUserData = { id: "user-123" };
      mockApiClientSession.get.mockResolvedValue(partialUserData);
      let result = await getUser();
      expect(result).toEqual(partialUserData);

      mockApiClientSession.get.mockResolvedValue({});
      result = await getUser();
      expect(result).toEqual({});

      mockApiClientSession.get.mockResolvedValue(null);
      result = await getUser();
      expect(result).toBeNull();
    });

    it("should handle session and request errors", async () => {
      const sessionError = new Error("Session creation failed");
      mockApiClient.apiClientSession.mockRejectedValue(sessionError);

      await expect(getUser()).rejects.toThrow("Session creation failed");
      expect(console.error).toHaveBeenCalledWith(sessionError);

      const requestError = new Error("Request failed");
      const mockApiClientSession = {
        get: jest.fn().mockRejectedValue(requestError),
      };

      mockApiClient.apiClientSession.mockResolvedValue(mockApiClientSession as any);
      await expect(getUser()).rejects.toThrow("Request failed");
      expect(console.error).toHaveBeenCalledWith(requestError);

      const unexpectedError = "String error";
      mockApiClient.apiClientSession.mockRejectedValue(unexpectedError);
      await expect(getUser()).rejects.toBe(unexpectedError);
      expect(console.error).toHaveBeenCalledWith(unexpectedError);
    });
  });
});
