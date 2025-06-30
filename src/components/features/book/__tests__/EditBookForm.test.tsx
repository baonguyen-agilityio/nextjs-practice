import { render, screen, fireEvent } from "@testing-library/react";
import EditBookForm from "../EditBookForm";
import type { Book, Category } from "@/types";
import type { ActionResult } from "@/app/actions/book";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, isLoading, isDisabled, type, ...props }: any) {
    return (
      <button
        onClick={onPress}
        disabled={isLoading || isDisabled}
        type={type}
        data-testid={`button-${children?.toLowerCase()?.replace(/\s+/g, "-")}`}
        data-loading={isLoading}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
}));

jest.mock("@heroui/react", () => ({
  Form: function MockForm({ children, onSubmit, ...props }: any) {
    return (
      <form onSubmit={onSubmit} data-testid="edit-form" {...props}>
        {children}
      </form>
    );
  },
}));

jest.mock("../BookFormFields", () => ({
  BookFormFields: function MockBookFormFields({
    formData,
    onFileChange,
    isDisabled,
    validationErrors,
    imageUrl,
  }: any) {
    return (
      <div data-testid="book-form-fields">
        <input
          type="text"
          name="title"
          value={formData.title}
          disabled={isDisabled}
          data-testid="title-input"
          readOnly
        />
        <input
          type="file"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          data-testid="file-input"
        />
        <div data-testid="current-image">{imageUrl}</div>
        {validationErrors.title && <span data-testid="title-error">{validationErrors.title}</span>}
        {validationErrors.image && <span data-testid="image-error">{validationErrors.image}</span>}
      </div>
    );
  },
  bookFields: [
    { name: "title", required: true },
    { name: "price", required: true },
    { name: "description", required: true },
  ],
}));

jest.mock("@/hooks/useFormValidation", () => ({
  useFormValidation: jest.fn(),
}));

jest.mock("@/schemas/book.schema", () => ({
  updateBookSchema: {},
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
  useState: jest.fn(),
  useMemo: jest.fn(),
  startTransition: jest.fn(),
}));

describe("EditBookForm", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-123",
    slug: "test-book",
    title: "Test Book Title",
    price: 19.99,
    language: "en",
    description: "A test book description",
    imageUrl: "/test-book.jpg",
    categories: [{ id: 1, documentId: "cat-1", name: "Fiction" }],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockOnClose = jest.fn();
  const mockFormAction = jest.fn();
  const mockUseRef = jest.fn();
  const mockUseState = jest.fn();
  const mockUseMemo = jest.fn();
  const mockStartTransition = jest.fn();
  const mockUseFormValidation = jest.fn();

  const defaultProps = {
    book: mockBook,
    onClose: mockOnClose,
    categories: mockCategories,
    formAction: mockFormAction,
    isPending: false,
    result: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const { useRef, useState, useMemo, startTransition } = require("react");
    const { useFormValidation } = require("@/hooks/useFormValidation");

    useRef.mockImplementation(mockUseRef);
    useState.mockImplementation(mockUseState);
    useMemo.mockImplementation(mockUseMemo);
    startTransition.mockImplementation(mockStartTransition);
    useFormValidation.mockImplementation(mockUseFormValidation);

    mockUseRef.mockReturnValue({ current: document.createElement("form") });
    mockUseState.mockReturnValue([null, jest.fn()]);
    mockStartTransition.mockImplementation((fn) => fn());
    mockUseMemo.mockReturnValue(false);
    mockUseFormValidation.mockReturnValue({
      formData: {
        title: "Test Book Title",
        price: "19.99",
        description: "A test book description",
        categories: "cat-1",
      },
      handleFieldChange: jest.fn(),
      combineErrors: jest.fn().mockReturnValue({}),
    });
  });

  it("renders form with all components and book data", () => {
    render(<EditBookForm {...defaultProps} />);

    expect(screen.getByTestId("edit-form")).toBeInTheDocument();
    expect(screen.getByTestId("book-form-fields")).toBeInTheDocument();
    expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
    expect(screen.getByTestId("button-update")).toBeInTheDocument();
    expect(screen.getByTestId("title-input")).toHaveValue("Test Book Title");
    expect(screen.getByTestId("current-image")).toHaveTextContent("/test-book.jpg");
  });

  it("handles form submission", () => {
    render(<EditBookForm {...defaultProps} />);

    const form = screen.getByTestId("edit-form");
    fireEvent.submit(form);

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockFormAction).toHaveBeenCalled();
  });

  it("handles cancel button click", () => {
    render(<EditBookForm {...defaultProps} />);

    const cancelButton = screen.getByTestId("button-cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when pending", () => {
    render(<EditBookForm {...defaultProps} isPending={true} />);

    const updateButton = screen.getByTestId("button-update");
    expect(updateButton).toHaveAttribute("data-loading", "true");
    expect(updateButton).toHaveTextContent("Loading...");
    expect(updateButton).toBeDisabled();
  });

  it("handles file selection", () => {
    const mockSetSelectedFile = jest.fn();
    mockUseState.mockReturnValue([null, mockSetSelectedFile]);

    render(<EditBookForm {...defaultProps} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput, "files", { value: [file], writable: false });
    fireEvent.change(fileInput);

    expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
  });

  it("handles field validation errors", () => {
    const fieldErrors = { title: ["Title is required"], image: ["Invalid image"] };
    const resultWithErrors: ActionResult = {
      success: false,
      error: fieldErrors,
    };

    mockUseFormValidation.mockReturnValue({
      formData: {},
      handleFieldChange: jest.fn(),
      combineErrors: jest.fn().mockReturnValue(fieldErrors),
    });

    render(<EditBookForm {...defaultProps} result={resultWithErrors} />);

    expect(screen.getByTestId("title-error")).toHaveTextContent("Title is required");
    expect(screen.getByTestId("image-error")).toHaveTextContent("Invalid image");
  });

  it("handles general error message", () => {
    const resultWithGeneralError: ActionResult = {
      success: false,
      error: "Something went wrong",
    };

    render(<EditBookForm {...defaultProps} result={resultWithGeneralError} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("disables update button when form is invalid", () => {
    mockUseMemo.mockReturnValue(true);

    render(<EditBookForm {...defaultProps} />);

    const updateButton = screen.getByTestId("button-update");
    expect(updateButton).toBeDisabled();
  });

  it("includes selected file when submitting form", () => {
    const selectedFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    mockUseState.mockReturnValue([selectedFile, jest.fn()]);

    render(<EditBookForm {...defaultProps} />);

    const form = screen.getByTestId("edit-form");
    fireEvent.submit(form);

    expect(mockFormAction).toHaveBeenCalled();
    expect(mockStartTransition).toHaveBeenCalled();
  });
});
