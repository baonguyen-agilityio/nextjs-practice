import { validateAuthHeader } from "../auth";

global.Request = class MockRequest {
  public headers: { get: (name: string) => string | null };

  constructor(url: string, init?: { headers?: Record<string, string> }) {
    const headerMap = new Map<string, string>();
    if (init?.headers) {
      Object.entries(init.headers).forEach(([key, value]) => {
        headerMap.set(key, value);
      });
    }

    this.headers = {
      get: (name: string) => headerMap.get(name) || null,
    };
  }
} as any;

global.Response = class MockResponse {
  public status: number;
  private body: string;

  constructor(body?: string, init?: { status?: number }) {
    this.body = body || "";
    this.status = init?.status || 200;
  }

  async json() {
    return JSON.parse(this.body);
  }
} as any;

describe("auth utilities", () => {
  describe("validateAuthHeader function", () => {
    it("should return null for valid Authorization header", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Bearer valid-token-123",
        },
      });

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeNull();
    });

    it("should return error response for missing Authorization header", () => {
      const mockRequest = new Request("http://localhost");

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);
    });

    it("should return error response for empty Authorization header", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "",
        },
      });

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);
    });

    it("should return error response for Authorization header without Bearer prefix", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Basic dXNlcjpwYXNz",
        },
      });

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);
    });

    it("should return error response for Bearer token without space", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Bearer",
        },
      });

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);
    });

    it("should return correct error message in response", async () => {
      const mockRequest = new Request("http://localhost");

      const result = validateAuthHeader(mockRequest);
      expect(result).not.toBeNull();

      if (result) {
        const responseBody = await result.json();
        expect(responseBody).toEqual({
          error: "Unauthorized: Missing or invalid token.",
        });
      }
    });

    it("should handle Authorization header with Bearer and valid token", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        },
      });

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeNull();
    });
  });
});
