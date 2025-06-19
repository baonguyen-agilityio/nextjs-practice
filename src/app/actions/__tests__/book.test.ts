import { createBook, updateBook, deleteBookAction } from "../book";
import { createBookService, deleteBook, updateBookService } from "@/services/book";
import { createBookSchema, updateBookSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { uploadImage } from "@/lib/utils/image";
import { API_ENDPOINTS } from "@/constants";

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/services/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/services/book");
jest.mock("@/lib/utils/image");
jest.mock("@/schemas");

const mockCreateBookService = createBookService as jest.MockedFunction<typeof createBookService>;
const mockDeleteBook = deleteBook as any;
const mockUpdateBookService = updateBookService as jest.MockedFunction<typeof updateBookService>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockUploadImage = uploadImage as jest.MockedFunction<typeof uploadImage>;
const mockCreateBookSchema = createBookSchema as any;
const mockUpdateBookSchema = updateBookSchema as any;

describe("Book Actions", () => {
  describe("createBook", () => {
    it("should create book successfully", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("image", new File(["test"], "test.jpg"));

      mockCreateBookSchema.safeParse.mockReturnValue({
        success: true,
        data: { title: "Test Book" },
      });
      mockUploadImage.mockResolvedValue("image-id");
      mockCreateBookService.mockResolvedValue({ success: true });

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: true,
        message: "Book created successfully",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS);
    });

    it("should return error when image missing", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: { image: ["Image is required"] },
      });
    });

    it("should return validation error", async () => {
      const formData = new FormData();
      formData.append("image", new File(["test"], "test.jpg"));

      mockCreateBookSchema.safeParse.mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: { title: ["Required"] } }) },
      });

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: { title: ["Required"] },
      });
    });

    it("should handle service error", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("image", new File(["test"], "test.jpg"));

      mockCreateBookSchema.safeParse.mockReturnValue({
        success: true,
        data: { title: "Test Book" },
      });
      mockUploadImage.mockResolvedValue("image-id");
      mockCreateBookService.mockResolvedValue({ success: false, error: "Service error" });

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Service error",
      });
    });

    it("should handle exceptions", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("image", new File(["test"], "test.jpg"));

      mockCreateBookSchema.safeParse.mockReturnValue({
        success: true,
        data: { title: "Test Book" },
      });
      mockUploadImage.mockRejectedValue(new Error("Upload failed"));

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Upload failed",
      });
    });
  });

  describe("updateBook", () => {
    it("should update book successfully", async () => {
      const formData = new FormData();
      formData.append("documentId", "book-123");
      formData.append("title", "Updated Book");

      mockUpdateBookSchema.safeParse.mockReturnValue({
        success: true,
        data: { title: "Updated Book" },
      });
      mockUpdateBookService.mockResolvedValue({ success: true });

      const result = await updateBook(undefined, formData);

      expect(result).toEqual({
        success: true,
        message: "Book updated successfully",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS);
    });

    it("should handle update service error", async () => {
      const formData = new FormData();
      formData.append("documentId", "book-123");
      formData.append("title", "Updated Book");

      mockUpdateBookSchema.safeParse.mockReturnValue({
        success: true,
        data: { title: "Updated Book" },
      });
      mockUpdateBookService.mockResolvedValue({ success: false, error: "Update failed" });

      const result = await updateBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Update failed",
      });
    });
  });

  describe("deleteBookAction", () => {
    it("should delete book successfully", async () => {
      const formData = new FormData();
      formData.append("id", "book-123");

      mockDeleteBook.mockResolvedValue({ book: null, error: null });

      const result = await deleteBookAction(undefined, formData);

      expect(result).toEqual({
        success: true,
        message: "Book deleted successfully",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS);
    });

    it("should return error when ID missing", async () => {
      const formData = new FormData();

      const result = await deleteBookAction(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Missing book ID",
      });
    });

    it("should handle delete service error", async () => {
      const formData = new FormData();
      formData.append("id", "book-123");

      mockDeleteBook.mockResolvedValue({ book: null, error: "Delete failed" });

      const result = await deleteBookAction(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Delete failed",
      });
    });
  });
});
