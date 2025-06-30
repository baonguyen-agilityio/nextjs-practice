import { render, screen, fireEvent } from "@testing-library/react";
import CreateBookForm from "../CreateBookForm";
import type { Category } from "@/types";

jest.mock("@/app/actions/book", () => ({
  createBook: jest.fn(),
}));

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
      <form onSubmit={onSubmit} data-testid="create-book-form" {...props}>
        {children}
      </form>
    );
  },
  addToast: jest.fn(),
}));

jest.mock("../BookFormFields", () => ({
  BookFormFields: function MockBookFormFields({ onFileChange, isDisabled, validationErrors }: any) {
    return (
      <div data-testid="book-form-fields">
        <input type="text" name="title" disabled={isDisabled} data-testid="title-input" />
        <input
          type="file"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          data-testid="file-input"
        />
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
  createBookSchema: {},
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
  useRef: jest.fn(),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useMemo: jest.fn(),
  startTransition: jest.fn(),
}));

describe("CreateBookForm", () => {
  const mockOnClose = jest.fn();
  const mockCategories: Category[] = [
    { id: 1, name: "Fiction", documentId: "doc-1" },
    { id: 2, name: "Mystery", documentId: "doc-2" },
  ];

  const mockFormAction = jest.fn();
  const mockUseActionState = jest.fn();
  const mockUseRef = jest.fn();
  const mockUseState = jest.fn();
  const mockUseEffect = jest.fn();
  const mockUseMemo = jest.fn();
  const mockStartTransition = jest.fn();
  const mockUseFormValidation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    const {
      useActionState,
      useRef,
      useState,
      useEffect,
      useMemo,
      startTransition,
    } = require("react");
    const { useFormValidation } = require("@/hooks/useFormValidation");

    useActionState.mockImplementation(mockUseActionState);
    useRef.mockImplementation(mockUseRef);
    useState.mockImplementation(mockUseState);
    useEffect.mockImplementation(mockUseEffect);
    useMemo.mockImplementation(mockUseMemo);
    startTransition.mockImplementation(mockStartTransition);
    useFormValidation.mockImplementation(mockUseFormValidation);

    mockUseActionState.mockReturnValue([undefined, mockFormAction, false]);
    mockUseRef.mockReturnValue({ current: document.createElement("form") });
    mockUseState.mockReturnValue([null, jest.fn()]);
    mockStartTransition.mockImplementation((fn) => fn());
    mockUseEffect.mockImplementation((effect) => effect());
    mockUseMemo.mockReturnValue(false);
    mockUseFormValidation.mockReturnValue({
      formData: { title: "Test", price: "19.99", description: "Test", categories: "doc-1" },
      handleFieldChange: jest.fn(),
      combineErrors: jest.fn().mockReturnValue({}),
      resetForm: jest.fn(),
    });
  });

  it("renders form with all components", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    expect(screen.getByTestId("create-book-form")).toBeInTheDocument();
    expect(screen.getByTestId("book-form-fields")).toBeInTheDocument();
    expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
    expect(screen.getByTestId("button-create")).toBeInTheDocument();
  });

  it("handles form submission", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const form = screen.getByTestId("create-book-form");
    fireEvent.submit(form);

    expect(mockStartTransition).toHaveBeenCalled();
    expect(mockFormAction).toHaveBeenCalled();
  });

  it("handles cancel button click", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const cancelButton = screen.getByTestId("button-cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when pending", () => {
    mockUseActionState.mockReturnValue([undefined, mockFormAction, true]);

    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const createButton = screen.getByTestId("button-create");
    expect(createButton).toHaveAttribute("data-loading", "true");
    expect(createButton).toHaveTextContent("Loading...");
    expect(createButton).toBeDisabled();
  });

  it("handles file selection", () => {
    const mockSetSelectedFile = jest.fn();
    mockUseState.mockReturnValue([null, mockSetSelectedFile]);

    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    Object.defineProperty(fileInput, "files", { value: [file], writable: false });
    fireEvent.change(fileInput);

    expect(mockSetSelectedFile).toHaveBeenCalledWith(file);
  });

  it("handles error result with field errors", () => {
    const fieldErrors = { title: ["Title is required"], image: ["Image is required"] };

    mockUseActionState.mockReturnValue([
      { success: false, error: fieldErrors },
      mockFormAction,
      false,
    ]);

    mockUseFormValidation.mockReturnValue({
      formData: {},
      handleFieldChange: jest.fn(),
      combineErrors: jest.fn().mockReturnValue(fieldErrors),
      resetForm: jest.fn(),
    });

    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    expect(screen.getByTestId("title-error")).toHaveTextContent("Title is required");
    expect(screen.getByTestId("image-error")).toHaveTextContent("Image is required");
  });

  it("disables create button when form is invalid", () => {
    mockUseMemo.mockReturnValue(true);

    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const createButton = screen.getByTestId("button-create");
    expect(createButton).toBeDisabled();
  });

  it("includes selected file when submitting form", () => {
    const selectedFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    mockUseState.mockReturnValue([selectedFile, jest.fn()]);

    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const form = screen.getByTestId("create-book-form");
    fireEvent.submit(form);

    expect(mockFormAction).toHaveBeenCalled();
    expect(mockStartTransition).toHaveBeenCalled();
  });
});
