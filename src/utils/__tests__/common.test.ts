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

describe("Common Utilities", () => {
  describe("validateAuthHeader function", () => {
    it("should validate Bearer tokens successfully", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Bearer valid-token-123",
        },
      });

      let result = validateAuthHeader(mockRequest);
      expect(result).toBeNull();

      const jwtRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        },
      });

      result = validateAuthHeader(jwtRequest);
      expect(result).toBeNull();
    });

    it("should handle missing and invalid headers", () => {
      const mockRequest = new Request("http://localhost");
      let result = validateAuthHeader(mockRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);

      const emptyRequest = new Request("http://localhost", {
        headers: { Authorization: "" },
      });
      result = validateAuthHeader(emptyRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);

      const basicRequest = new Request("http://localhost", {
        headers: { Authorization: "Basic dXNlcjpwYXNz" },
      });
      result = validateAuthHeader(basicRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);

      const bearerOnlyRequest = new Request("http://localhost", {
        headers: { Authorization: "Bearer" },
      });
      result = validateAuthHeader(bearerOnlyRequest);
      expect(result).toBeInstanceOf(Response);
      expect(result?.status).toBe(401);
    });

    it("should return correct error message", async () => {
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
  });
});
