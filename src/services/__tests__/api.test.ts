import { ApiClient } from "../api";
import { auth } from "@/lib/auth/auth";

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockAuth = auth as any;

jest.mock("@/constants/api", () => ({
  API_URL: "https://api.example.com",
  AUTH_TOKEN: "test-auth-token",
}));

describe("ApiClient", () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiClient as any).apiClientInstance = null;
    apiClient = ApiClient.create({
      baseURL: "https://api.example.com",
      headers: { Authorization: "Bearer test-token" },
    });
  });

  describe("Client creation", () => {
    it("should create singleton instance with default and custom headers", () => {
      (ApiClient as any).apiClientInstance = null;
      const client1 = ApiClient.create({ baseURL: "https://api.example.com" });
      const client2 = ApiClient.create({ baseURL: "https://api.example.com" });

      expect(client1).toBe(client2);
      expect(client1.config.headers).toEqual({ Authorization: "Bearer test-auth-token" });
    });

    it("should handle session authentication", async () => {
      const mockSession = {
        user: { id: "user-123", token: "user-token" },
      };
      mockAuth.mockResolvedValue(mockSession);

      const sessionClient = await apiClient.apiClientSession();

      expect(sessionClient.config.headers).toEqual({
        Authorization: "Bearer user-token",
      });

      mockAuth.mockResolvedValue(null);
      await expect(apiClient.apiClientSession()).rejects.toThrow("Not found user!");
    });
  });

  describe("HTTP methods", () => {
    it("should handle GET requests", async () => {
      const mockResponse = { data: "test data" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await apiClient.get<typeof mockResponse>("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          headers: { Authorization: "Bearer test-token" },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle POST requests", async () => {
      const mockResponse = { id: "123", message: "Created" };
      const postData = { name: "Test" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await apiClient.post<typeof mockResponse>("/test", {
        body: postData,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(postData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle PUT requests", async () => {
      const mockResponse = { id: "123", message: "Updated" };
      const putData = { name: "Updated Test" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await apiClient.put<typeof mockResponse>("/test", {
        body: putData,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(putData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle DELETE requests", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      } as any);

      const result = await apiClient.delete("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result).toEqual({ success: true });
    });

    it("should handle file uploads", async () => {
      const mockResponse = { url: "uploaded-file-url" };
      const formData = new FormData();
      formData.append("file", new File(["content"], "test.txt"));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await apiClient.postFile<typeof mockResponse>("/upload", {
        body: formData,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/upload",
        expect.objectContaining({
          method: "POST",
          body: formData,
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error handling", () => {
    const errorCases = [
      { method: "get", endpoint: "/test" },
      { method: "post", endpoint: "/test", options: { body: {} } },
      { method: "put", endpoint: "/test", options: { body: {} } },
      { method: "delete", endpoint: "/test" },
      { method: "postFile", endpoint: "/upload", options: { body: new FormData() } },
    ];

    errorCases.forEach(({ method, endpoint, options }) => {
      it(`should handle ${method.toUpperCase()} request errors`, async () => {
        const errorText = "Request failed";
        mockFetch.mockResolvedValueOnce({
          ok: false,
          text: jest.fn().mockResolvedValue(errorText),
        } as any);

        const result = options
          ? await (apiClient as any)[method](endpoint, options)
          : await (apiClient as any)[method](endpoint);

        expect(result).toEqual({ error: errorText });
      });
    });
  });
});
