import { cn, validateAuthHeader } from "../common";

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

describe("common utilities", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      const result = cn("text-red-500", "bg-blue-500");
      expect(result).toBe("text-red-500 bg-blue-500");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("should handle false conditions", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class");
    });

    it("should merge conflicting Tailwind classes", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["text-red-500", "bg-blue-500"], "p-4");
      expect(result).toBe("text-red-500 bg-blue-500 p-4");
    });

    it("should handle objects with boolean values", () => {
      const result = cn({
        "text-red-500": true,
        "bg-blue-500": false,
        "p-4": true,
      });
      expect(result).toBe("text-red-500 p-4");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base-class", undefined, null, "another-class");
      expect(result).toBe("base-class another-class");
    });

    it("should handle empty strings", () => {
      const result = cn("base-class", "", "another-class");
      expect(result).toBe("base-class another-class");
    });
  });

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

    it("should return null for Bearer token without space", () => {
      const mockRequest = new Request("http://localhost", {
        headers: {
          Authorization: "Bearer",
        },
      });

      const result = validateAuthHeader(mockRequest);
      expect(result).toBeNull();
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
