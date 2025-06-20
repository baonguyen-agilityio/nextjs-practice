import { uploadImage } from "../image";

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const originalEnv = process.env;

describe("uploadImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_STRAPI_URL: "https://api.example.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Input validation", () => {
    it("should return null for null or empty image", async () => {
      expect(await uploadImage(null)).toBe(null);

      const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
      expect(await uploadImage(emptyFile)).toBe(null);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should throw error for invalid file type", async () => {
      const invalidFile = new File(["content"], "file.txt", { type: "text/plain" });

      await expect(uploadImage(invalidFile)).rejects.toThrow(
        "Only JPG and PNG formats are allowed."
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should throw error for oversized image", async () => {
      const largeContent = new Array(3 * 1024 * 1024).fill("a").join("");
      const largeFile = new File([largeContent], "large.jpg", { type: "image/jpeg" });

      await expect(uploadImage(largeFile)).rejects.toThrow("Max image size is 2MB.");
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Successful uploads", () => {
    it("should successfully upload JPEG and PNG images", async () => {
      const jpegFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });
      const mockResponse = [{ id: "uploaded-image-id" }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      const result = await uploadImage(jpegFile);

      expect(result).toBe("uploaded-image-id");
      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/api/upload", {
        method: "POST",
        body: expect.any(FormData),
      });

      const formData = mockFetch.mock.calls[0]![1]?.body as FormData;
      expect(formData.get("files")).toBe(jpegFile);
    });

    it("should handle response without id", async () => {
      const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([{}]),
      } as any);

      expect(await uploadImage(validFile)).toBe(null);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      } as any);

      expect(await uploadImage(validFile)).toBe(null);
    });
  });

  describe("Error handling", () => {
    it("should handle upload failures", async () => {
      const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as any);

      await expect(uploadImage(validFile)).rejects.toThrow("Image upload failed.");
    });

    it("should handle network errors", async () => {
      const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(uploadImage(validFile)).rejects.toThrow("Network error");
    });

    it("should handle JSON parsing errors", async () => {
      const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as any);

      await expect(uploadImage(validFile)).rejects.toThrow("Invalid JSON");
    });
  });

  describe("Size validation edge cases", () => {
    it("should accept file at exact size limit", async () => {
      const exactLimitContent = new Array(2 * 1024 * 1024).fill("a").join("");
      const exactLimitFile = new File([exactLimitContent], "limit.jpg", { type: "image/jpeg" });
      const mockResponse = [{ id: "limit-image-id" }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any);

      expect(await uploadImage(exactLimitFile)).toBe("limit-image-id");
    });

    it("should reject file over size limit", async () => {
      const overLimitContent = new Array(2 * 1024 * 1024 + 1).fill("a").join("");
      const overLimitFile = new File([overLimitContent], "overlimit.jpg", { type: "image/jpeg" });

      await expect(uploadImage(overLimitFile)).rejects.toThrow("Max image size is 2MB.");
    });
  });
});
