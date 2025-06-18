import { createBook, updateBook, deleteBookAction } from "../book";
import { createBookService, deleteBook, updateBookService } from "@/services/book";
import { createBookSchema, updateBookSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { uploadImage } from "@/lib/utils/image";
import { API_ENDPOINTS } from "@/constants";

jest.mock("@/services/book", () => ({
  createBookService: jest.fn(),
  deleteBook: jest.fn(),
  updateBookService: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

jest.mock("@/lib/utils/image", () => ({
  uploadImage: jest.fn(),
}));

jest.mock("@/schemas", () => ({
  createBookSchema: {
    safeParse: jest.fn(),
  },
  updateBookSchema: {
    safeParse: jest.fn(),
  },
}));

const mockCreateBookService = createBookService as jest.MockedFunction<typeof createBookService>;
const mockDeleteBook = deleteBook as any;
const mockUpdateBookService = updateBookService as jest.MockedFunction<typeof updateBookService>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockUploadImage = uploadImage as jest.MockedFunction<typeof uploadImage>;
const mockCreateBookSchema = createBookSchema as any;
const mockUpdateBookSchema = updateBookSchema as any;

describe("Book Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBook", () => {
    it("should successfully create a book with image", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("price", "29.99");
      formData.append("description", "Test description");
      formData.append("categories", "category-1");
      formData.append("language", "English");

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      formData.append("image", mockFile);

      const mockValidationResult = {
        success: true as const,
        data: {
          title: "Test Book",
          price: 29.99,
          description: "Test description",
          categories: "category-1",
          language: "English",
        },
      };

      mockCreateBookSchema.safeParse.mockReturnValue(mockValidationResult);
      mockUploadImage.mockResolvedValue("uploaded-image-id");
      mockCreateBookService.mockResolvedValue({ success: true });

      const result = await createBook(undefined, formData);

      expect(mockCreateBookSchema.safeParse).toHaveBeenCalledWith({
        title: "Test Book",
        price: "29.99",
        description: "Test description",
        categories: "category-1",
        language: "English",
      });
      expect(mockUploadImage).toHaveBeenCalledWith(mockFile);
      expect(mockCreateBookService).toHaveBeenCalledWith({
        ...mockValidationResult.data,
        image: "uploaded-image-id",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS);
      expect(result).toEqual({
        success: true,
        message: "Book created successfully",
      });
    });

    it("should return error when image is missing for create", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("price", "29.99");

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: { image: ["Image is required"] },
      });
      expect(mockCreateBookSchema.safeParse).not.toHaveBeenCalled();
    });

    it("should return error when validation fails", async () => {
      const formData = new FormData();
      formData.append("title", "");
      formData.append("price", "invalid");

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      formData.append("image", mockFile);

      const mockValidationResult = {
        success: false as const,
        error: {
          flatten: () => ({
            fieldErrors: {
              title: ["Title is required"],
              price: ["Invalid price"],
            },
          }),
        },
      };

      mockCreateBookSchema.safeParse.mockReturnValue(mockValidationResult);

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: {
          title: ["Title is required"],
          price: ["Invalid price"],
        },
      });
      expect(mockUploadImage).not.toHaveBeenCalled();
    });

    it("should handle service error", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("price", "29.99");
      formData.append("description", "Test description");
      formData.append("categories", "category-1");

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      formData.append("image", mockFile);

      const mockValidationResult = {
        success: true,
        data: {
          title: "Test Book",
          price: 29.99,
          description: "Test description",
          categories: "category-1",
        },
      };

      mockCreateBookSchema.safeParse.mockReturnValue(mockValidationResult);
      mockUploadImage.mockResolvedValue("uploaded-image-id");
      mockCreateBookService.mockResolvedValue({
        success: false,
        error: "Service error",
      });

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Service error",
      });
      expect(mockRevalidateTag).not.toHaveBeenCalled();
    });

    it("should handle exceptions", async () => {
      const formData = new FormData();
      formData.append("title", "Test Book");
      formData.append("price", "29.99");
      formData.append("description", "Test description");
      formData.append("categories", "category-1");

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      formData.append("image", mockFile);

      const mockValidationResult = {
        success: true,
        data: {
          title: "Test Book",
          price: 29.99,
          description: "Test description",
          categories: "category-1",
        },
      };

      mockCreateBookSchema.safeParse.mockReturnValue(mockValidationResult);
      mockUploadImage.mockRejectedValue(new Error("Upload failed"));

      const result = await createBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Upload failed",
      });
    });
  });

  describe("updateBook", () => {
    it("should successfully update a book", async () => {
      const formData = new FormData();
      formData.append("documentId", "book-123");
      formData.append("title", "Updated Book");
      formData.append("price", "39.99");
      formData.append("description", "Updated description");
      formData.append("categories", "category-2");

      const mockValidationResult = {
        success: true,
        data: {
          title: "Updated Book",
          price: 39.99,
          description: "Updated description",
          categories: "category-2",
        },
      };

      mockUpdateBookSchema.safeParse.mockReturnValue(mockValidationResult);
      mockUpdateBookService.mockResolvedValue({ success: true });

      const result = await updateBook(undefined, formData);

      expect(mockUpdateBookSchema.safeParse).toHaveBeenCalledWith({
        documentId: "book-123",
        title: "Updated Book",
        price: "39.99",
        description: "Updated description",
        categories: "category-2",
      });
      expect(mockUpdateBookService).toHaveBeenCalledWith("book-123", mockValidationResult.data);
      expect(mockRevalidateTag).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS);
      expect(result).toEqual({
        success: true,
        message: "Book updated successfully",
      });
    });

    it("should update book with new image", async () => {
      const formData = new FormData();
      formData.append("documentId", "book-123");
      formData.append("title", "Updated Book");
      formData.append("price", "39.99");
      formData.append("description", "Updated description");
      formData.append("categories", "category-2");

      const mockFile = new File(["updated"], "updated.jpg", { type: "image/jpeg" });
      formData.append("image", mockFile);

      const mockValidationResult = {
        success: true,
        data: {
          title: "Updated Book",
          price: 39.99,
          description: "Updated description",
          categories: "category-2",
        },
      };

      mockUpdateBookSchema.safeParse.mockReturnValue(mockValidationResult);
      mockUploadImage.mockResolvedValue("new-image-id");
      mockUpdateBookService.mockResolvedValue({ success: true });

      const result = await updateBook(undefined, formData);

      expect(mockUploadImage).toHaveBeenCalledWith(mockFile);
      expect(mockUpdateBookService).toHaveBeenCalledWith("book-123", {
        ...mockValidationResult.data,
        image: "new-image-id",
      });
      expect(result).toEqual({
        success: true,
        message: "Book updated successfully",
      });
    });

    it("should handle update service error", async () => {
      const formData = new FormData();
      formData.append("documentId", "book-123");
      formData.append("title", "Updated Book");

      const mockValidationResult = {
        success: true,
        data: { title: "Updated Book" },
      };

      mockUpdateBookSchema.safeParse.mockReturnValue(mockValidationResult);
      mockUpdateBookService.mockResolvedValue({
        success: false,
        error: "Update failed",
      });

      const result = await updateBook(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Update failed",
      });
    });
  });

  describe("deleteBookAction", () => {
    it("should successfully delete a book", async () => {
      const formData = new FormData();
      formData.append("id", "book-123");

      mockDeleteBook.mockResolvedValue({ book: null, error: null });

      const result = await deleteBookAction(undefined, formData);

      expect(mockDeleteBook).toHaveBeenCalledWith({ id: "book-123" });
      expect(mockRevalidateTag).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS);
      expect(result).toEqual({
        success: true,
        message: "Book deleted successfully",
      });
    });

    it("should return error when book ID is missing", async () => {
      const formData = new FormData();

      const result = await deleteBookAction(undefined, formData);

      expect(result).toEqual({
        success: false,
        error: "Missing book ID",
      });
      expect(mockDeleteBook).not.toHaveBeenCalled();
    });

    it("should handle delete service error", async () => {
      const formData = new FormData();
      formData.append("id", "book-123");

      mockDeleteBook.mockResolvedValue({
        book: null,
        error: "Delete failed",
      });

      const result = await deleteBookAction(undefined, formData);

      expect(mockDeleteBook).toHaveBeenCalledWith({ id: "book-123" });
      expect(result).toEqual({
        success: false,
        error: "Delete failed",
      });
      expect(mockRevalidateTag).not.toHaveBeenCalled();
    });
  });
});
