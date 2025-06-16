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

  it("should return null for null image", async () => {
    const result = await uploadImage(null);

    expect(result).toBe(null);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return null for empty image", async () => {
    const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });

    const result = await uploadImage(emptyFile);

    expect(result).toBe(null);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should throw error for invalid file type", async () => {
    const invalidFile = new File(["content"], "file.txt", { type: "text/plain" });

    await expect(uploadImage(invalidFile)).rejects.toThrow("Only JPG and PNG formats are allowed.");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should throw error for oversized image", async () => {
    const largeContent = new Array(3 * 1024 * 1024).fill("a").join(""); // 3MB content
    const largeFile = new File([largeContent], "large.jpg", { type: "image/jpeg" });

    await expect(uploadImage(largeFile)).rejects.toThrow("Max image size is 2MB.");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should successfully upload valid JPEG image", async () => {
    const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });
    const mockResponse = [{ id: "uploaded-image-id" }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await uploadImage(validFile);

    expect(result).toBe("uploaded-image-id");
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/api/upload", {
      method: "POST",
      body: expect.any(FormData),
    });

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs).toBeDefined();
    const formData = callArgs![1]?.body as FormData;
    expect(formData.get("files")).toBe(validFile);
  });

  it("should successfully upload valid PNG image", async () => {
    const validFile = new File(["image content"], "test.png", { type: "image/png" });
    const mockResponse = [{ id: "uploaded-png-id" }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await uploadImage(validFile);

    expect(result).toBe("uploaded-png-id");
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/api/upload", {
      method: "POST",
      body: expect.any(FormData),
    });
  });

  it("should return null if upload response has no id", async () => {
    const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });
    const mockResponse = [{}]; // No id property

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await uploadImage(validFile);

    expect(result).toBe(null);
  });

  it("should return null if upload response is empty array", async () => {
    const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });
    const mockResponse: any[] = [];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await uploadImage(validFile);

    expect(result).toBe(null);
  });

  it("should throw error when upload fails", async () => {
    const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as any);

    await expect(uploadImage(validFile)).rejects.toThrow("Image upload failed.");
  });

  it("should throw error when fetch throws", async () => {
    const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(uploadImage(validFile)).rejects.toThrow("Network error");
  });

  it("should handle file exactly at size limit", async () => {
    const exactLimitContent = new Array(2 * 1024 * 1024).fill("a").join(""); // Exactly 2MB
    const exactLimitFile = new File([exactLimitContent], "limit.jpg", { type: "image/jpeg" });
    const mockResponse = [{ id: "limit-image-id" }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await uploadImage(exactLimitFile);

    expect(result).toBe("limit-image-id");
  });

  it("should reject file just over size limit", async () => {
    const overLimitContent = new Array(2 * 1024 * 1024 + 1).fill("a").join(""); // Just over 2MB
    const overLimitFile = new File([overLimitContent], "overlimit.jpg", { type: "image/jpeg" });

    await expect(uploadImage(overLimitFile)).rejects.toThrow("Max image size is 2MB.");
  });

  it("should handle response with malformed JSON", async () => {
    const validFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    } as any);

    await expect(uploadImage(validFile)).rejects.toThrow("Invalid JSON");
  });
});
