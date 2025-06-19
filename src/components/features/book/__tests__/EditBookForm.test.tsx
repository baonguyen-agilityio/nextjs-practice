import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditBookForm from "../EditBookForm";
import type { Book, Category } from "@/types";
import type { ActionResult } from "@/app/actions/book";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, color, variant, type, isLoading }: any) {
    return (
      <button
        onClick={onPress}
        data-testid={`button-${children.toLowerCase()}`}
        data-color={color}
        data-variant={variant}
        type={type}
        disabled={isLoading}
        data-loading={isLoading}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/Input", () => ({
  Input: function MockInput({
    id,
    name,
    label,
    type,
    isRequired,
    defaultValue,
    isDisabled,
    size,
    errorMessage,
  }: any) {
    return (
      <div data-testid={`input-${name}`}>
        <label htmlFor={id}>
          {label}
          {isRequired && " *"}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          disabled={isDisabled}
          data-size={size}
          data-required={isRequired}
        />
        {errorMessage && (
          <div data-testid={`error-${name}`} className="text-red-500">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
}));

jest.mock("@heroui/react", () => ({
  Form: function MockForm({ children, onSubmit, className, ...props }: any) {
    return (
      <form onSubmit={onSubmit} className={className} {...props} data-testid="edit-form">
        {children}
      </form>
    );
  },
  Select: function MockSelect({
    name,
    label,
    placeholder,
    isRequired,
    isDisabled,
    size,
    defaultSelectedKeys,
    children,
  }: any) {
    return (
      <div data-testid={`select-${name}`}>
        <label>
          {label}
          {isRequired && " *"}
        </label>
        <select
          name={name}
          disabled={isDisabled}
          data-size={size}
          data-required={isRequired}
          defaultValue={defaultSelectedKeys?.[0] || ""}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
      </div>
    );
  },
  SelectItem: function MockSelectItem({ children, "aria-label": ariaLabel, keyValue }: any) {
    return (
      <option value={keyValue} aria-label={ariaLabel}>
        {children}
      </option>
    );
  },
}));

jest.mock("../ImagePicker", () => {
  return function MockImagePicker({ imageUrl, onFileChange }: any) {
    return (
      <div data-testid="image-picker">
        <div data-testid="current-image-url">{imageUrl}</div>
        <input
          type="file"
          data-testid="file-input"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </div>
    );
  };
});

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
    { id: 3, documentId: "cat-3", name: "Science Fiction" },
  ];

  const mockOnClose = jest.fn();
  const mockFormAction = jest.fn();

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
  });

  describe("Form Rendering", () => {
    it("should render form with all fields and default values", () => {
      render(<EditBookForm {...defaultProps} />);

      expect(screen.getByTestId("edit-form")).toBeInTheDocument();
      expect(screen.getByTestId("input-title")).toBeInTheDocument();
      expect(screen.getByTestId("input-price")).toBeInTheDocument();
      expect(screen.getByTestId("input-language")).toBeInTheDocument();
      expect(screen.getByTestId("input-description")).toBeInTheDocument();
      expect(screen.getByTestId("select-categories")).toBeInTheDocument();
      expect(screen.getByTestId("image-picker")).toBeInTheDocument();
      expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
      expect(screen.getByTestId("button-update")).toBeInTheDocument();

      // Check default values
      expect(screen.getByDisplayValue("Test Book Title")).toBeInTheDocument();
      expect(screen.getByDisplayValue("19.99")).toBeInTheDocument();
      expect(screen.getByDisplayValue("en")).toBeInTheDocument();
      expect(screen.getByDisplayValue("A test book description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("doc-123")).toBeInTheDocument();
    });

    it("should pass image URL to ImagePicker", () => {
      render(<EditBookForm {...defaultProps} />);

      expect(screen.getByTestId("current-image-url")).toHaveTextContent("/test-book.jpg");
    });
  });

  describe("Form Submission", () => {
    it("should call formAction with form data on submit", async () => {
      render(<EditBookForm {...defaultProps} />);

      const form = screen.getByTestId("edit-form");
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockFormAction).toHaveBeenCalledTimes(1);
        expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
      });
    });

    it("should include image file in form data when file is selected", async () => {
      render(<EditBookForm {...defaultProps} />);

      const fileInput = screen.getByTestId("file-input");
      const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [testFile] } });

      const form = screen.getByTestId("edit-form");
      fireEvent.submit(form);

      await waitFor(() => {
        const formData = mockFormAction.mock.calls[0][0] as FormData;
        expect(formData.get("image")).toBe(testFile);
      });
    });
  });

  describe("Button Interactions", () => {
    it("should call onClose when Cancel button is clicked", () => {
      render(<EditBookForm {...defaultProps} />);

      fireEvent.click(screen.getByTestId("button-cancel"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should show loading state on Update button when pending", () => {
      render(<EditBookForm {...defaultProps} isPending={true} />);

      const updateButton = screen.getByTestId("button-update");
      expect(updateButton).toHaveAttribute("data-loading", "true");
      expect(updateButton).toBeDisabled();
      expect(updateButton).toHaveTextContent("Loading...");
    });
  });

  describe("Error Handling", () => {
    it("should display field errors", () => {
      const resultWithFieldErrors: ActionResult = {
        success: false,
        error: {
          title: ["Title is required"],
          price: ["Price must be positive"],
          categories: ["Category is required"],
          image: ["Image file is invalid"],
        },
      };

      render(<EditBookForm {...defaultProps} result={resultWithFieldErrors} />);

      expect(screen.getByTestId("error-title")).toHaveTextContent("Title is required");
      expect(screen.getByTestId("error-price")).toHaveTextContent("Price must be positive");
      expect(screen.getByText("Category is required")).toBeInTheDocument();
      expect(screen.getByText("Image file is invalid")).toBeInTheDocument();
    });

    it("should display general error message", () => {
      const resultWithGeneralError: ActionResult = {
        success: false,
        error: "Something went wrong",
      };

      render(<EditBookForm {...defaultProps} result={resultWithGeneralError} />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
