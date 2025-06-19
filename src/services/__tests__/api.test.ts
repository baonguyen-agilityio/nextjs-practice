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

  describe("create", () => {
    it("should create singleton instance", () => {
      const client1 = ApiClient.create({ baseURL: "https://api.example.com" });
      const client2 = ApiClient.create({ baseURL: "https://api.example.com" });

      expect(client1).toBe(client2);
    });

    it("should use default headers when not provided", () => {
      (ApiClient as any).apiClientInstance = null;

      const client = ApiClient.create({ baseURL: "https://api.example.com" });

      expect(client.config.headers).toEqual({ Authorization: "Bearer test-auth-token" });
    });
  });

  describe("apiClientSession", () => {
    it("should create authenticated client with user token", async () => {
      const mockSession = {
        user: {
          id: "user-123",
          token: "user-token",
        },
      };
      mockAuth.mockResolvedValue(mockSession);

      const sessionClient = await apiClient.apiClientSession();

      expect(mockAuth).toHaveBeenCalled();
      expect(sessionClient.config.headers).toEqual({
        Authorization: "Bearer user-token",
      });
    });

    it("should throw error when no user session", async () => {
      mockAuth.mockResolvedValue(null);

      await expect(apiClient.apiClientSession()).rejects.toThrow("Not found user!");
    });
  });

  describe("get", () => {
    it("should make successful GET request", async () => {
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

    it("should return error when GET request fails", async () => {
      const errorText = "Server error";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue(errorText),
      } as any);

      const result = await apiClient.get("/test");

      expect(result).toEqual({ error: errorText });
    });
  });

  describe("post", () => {
    it("should make successful POST request", async () => {
      const mockResponse = { id: "123", message: "Created" };
      const postData = { name: "Test", value: "test value" };
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

    it("should return error when POST request fails", async () => {
      const errorText = "Validation error";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue(errorText),
      } as any);

      const result = await apiClient.post("/test", { body: {} });

      expect(result).toEqual({ error: errorText });
    });
  });

  describe("put", () => {
    it("should make successful PUT request", async () => {
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
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should return error when PUT request fails", async () => {
      const errorText = "Update failed";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue(errorText),
      } as any);

      const result = await apiClient.put("/test", { body: {} });

      expect(result).toEqual({ error: errorText });
    });
  });

  describe("delete", () => {
    it("should make successful DELETE request", async () => {
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

    it("should return error when DELETE request fails", async () => {
      const errorText = "Delete failed";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue(errorText),
      } as any);

      const result = await apiClient.delete("/test");

      expect(result).toEqual({ error: errorText });
    });
  });

  describe("postFile", () => {
    it("should make successful file POST request", async () => {
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

    it("should return error when file POST request fails", async () => {
      const errorText = "Upload failed";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue(errorText),
      } as any);

      const result = await apiClient.postFile("/upload", { body: new FormData() });

      expect(result).toEqual({ error: errorText });
    });
  });
});
