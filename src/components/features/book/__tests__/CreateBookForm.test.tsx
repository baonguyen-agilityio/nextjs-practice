import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBookForm from "../CreateBookForm";
import type { Category } from "@/types";

const mockFormAction = jest.fn();
const mockUseActionState = jest.fn();
const mockUseRef = jest.fn();
const mockUseState = jest.fn();
const mockUseEffect = jest.fn();
const mockStartTransition = jest.fn();
const mockAddToast = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (...args: any[]) => mockUseActionState(...args),
  useRef: (...args: any[]) => mockUseRef(...args),
  useState: (...args: any[]) => mockUseState(...args),
  useEffect: (...args: any[]) => mockUseEffect(...args),
  startTransition: (...args: any[]) => mockStartTransition(...args),
}));

jest.mock("@/app/actions/book", () => ({
  createBook: jest.fn(),
}));

jest.mock("@heroui/react", () => ({
  addToast: (...args: any[]) => mockAddToast(...args),
  Form: ({ children, onSubmit, className, ...props }: any) => (
    <form onSubmit={onSubmit} className={className} data-testid="create-book-form" {...props}>
      {children}
    </form>
  ),
  Select: ({ name, label, placeholder, isRequired, children, size, isDisabled, ...props }: any) => (
    <div data-testid={`select-${name}`}>
      <label htmlFor={name}>
        {label} {isRequired && "*"}
      </label>
      <select
        id={name}
        name={name}
        required={isRequired}
        disabled={isDisabled}
        data-size={size}
        {...props}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  ),
  SelectItem: ({ children, ...props }: any) => (
    <option value={children} {...props}>
      {children}
    </option>
  ),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ label, name, type, isRequired, errorMessage, isDisabled, size, ...props }: any) => (
    <div data-testid={`input-${name}`}>
      <label htmlFor={name}>
        {label} {isRequired && "*"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={isRequired}
        disabled={isDisabled}
        data-size={size}
        {...props}
      />
      {errorMessage && (
        <span data-testid={`error-${name}`} className="error">
          {errorMessage}
        </span>
      )}
    </div>
  ),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, type, color, variant, isLoading, isDisabled, onPress, ...props }: any) => (
    <button
      type={type}
      onClick={onPress}
      className={`${color} ${variant}`}
      disabled={isLoading || isDisabled}
      data-loading={isLoading}
      data-testid={`button-${children?.toLowerCase()?.replace(/\s+/g, "-") || "button"}`}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

jest.mock("@/components/features/book/ImagePicker", () => ({
  __esModule: true,
  default: ({ imageUrl, onFileChange }: any) => (
    <div data-testid="image-picker">
      <label htmlFor="image">Image Upload</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        data-testid="file-input"
      />
      {imageUrl && <div data-testid="current-image">{imageUrl}</div>}
    </div>
  ),
}));

describe("CreateBookForm", () => {
  const mockOnClose = jest.fn();
  const mockCategories: Category[] = [
    { id: 1, name: "Fiction", documentId: "doc-1" },
    { id: 2, name: "Mystery", documentId: "doc-2" },
  ];

  const defaultFormRef = { current: document.createElement("form") };
  const defaultSetSelectedFile = jest.fn();
  const defaultHandledRef = { current: false };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseActionState.mockReturnValue([undefined, mockFormAction, false]);
    mockUseRef.mockImplementation((initial) => {
      if (initial === null) return defaultFormRef;
      return defaultHandledRef;
    });
    mockUseState.mockReturnValue([null, defaultSetSelectedFile]);
    mockStartTransition.mockImplementation((fn) => fn());
    mockUseEffect.mockImplementation((effect) => effect());
  });

  describe("Component Rendering", () => {
    it("should render form with all required fields", () => {
      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByTestId("create-book-form")).toBeInTheDocument();
      expect(screen.getByTestId("input-title")).toBeInTheDocument();
      expect(screen.getByTestId("input-price")).toBeInTheDocument();
      expect(screen.getByTestId("input-language")).toBeInTheDocument();
      expect(screen.getByTestId("input-description")).toBeInTheDocument();
      expect(screen.getByTestId("select-categories")).toBeInTheDocument();
      expect(screen.getByTestId("image-picker")).toBeInTheDocument();
    });

    it("should render category options correctly", () => {
      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByText("Fiction")).toBeInTheDocument();
      expect(screen.getByText("Mystery")).toBeInTheDocument();
    });

    it("should render action buttons", () => {
      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByTestId("button-cancel")).toBeInTheDocument();
      expect(screen.getByTestId("button-create")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should display field errors when present", () => {
      const fieldErrors = {
        title: ["Title is required"],
        price: ["Price must be a number"],
        categories: ["Category is required"],
        image: ["Image is required"],
      };

      mockUseActionState.mockReturnValue([
        { success: false, error: fieldErrors },
        mockFormAction,
        false,
      ]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByTestId("error-title")).toHaveTextContent("Title is required");
      expect(screen.getByTestId("error-price")).toHaveTextContent("Price must be a number");
      expect(screen.getByText("Category is required")).toBeInTheDocument();
      expect(screen.getByText("Image is required")).toBeInTheDocument();
    });

    it("should display general error when present", () => {
      mockUseActionState.mockReturnValue([
        { success: false, error: "Something went wrong" },
        mockFormAction,
        false,
      ]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should handle form submission", () => {
      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      const form = screen.getByTestId("create-book-form");
      fireEvent.submit(form);

      expect(mockStartTransition).toHaveBeenCalled();
      expect(mockFormAction).toHaveBeenCalled();
    });

    it("should include selected file in form data", () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      mockUseState.mockReturnValue([mockFile, defaultSetSelectedFile]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      const form = screen.getByTestId("create-book-form");
      fireEvent.submit(form);

      expect(mockFormAction).toHaveBeenCalled();
    });
  });

  describe("Loading States", () => {
    it("should disable form fields when pending", () => {
      mockUseActionState.mockReturnValue([undefined, mockFormAction, true]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByLabelText("Title *")).toBeDisabled();
      expect(screen.getByLabelText("Price *")).toBeDisabled();
      expect(screen.getByLabelText("Category *")).toBeDisabled();
    });

    it("should show loading state on create button", () => {
      mockUseActionState.mockReturnValue([undefined, mockFormAction, true]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      const createButton = screen.getByTestId("button-create");
      expect(createButton).toHaveAttribute("data-loading", "true");
      expect(createButton).toHaveTextContent("Loading...");
      expect(createButton).toBeDisabled();
    });
  });

  describe("Button Interactions", () => {
    it("should call onClose when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      const cancelButton = screen.getByTestId("button-cancel");
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Success Handling", () => {
    it("should show success toast and close modal on successful creation", () => {
      const mockEffect = jest.fn();
      mockUseEffect.mockImplementation((callback, deps) => {
        if (deps && deps.some((dep: any) => dep?.success === true)) {
          callback();
        }
        mockEffect(callback, deps);
      });

      mockUseActionState.mockReturnValue([
        { success: true, message: "Book created successfully" },
        mockFormAction,
        false,
      ]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(mockAddToast).toHaveBeenCalledWith({
        title: "Book created successfully",
        color: "success",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not show toast notifications multiple times", () => {
      const handledRef = { current: true };
      mockUseRef.mockImplementation((initial) => {
        if (initial === null) return defaultFormRef;
        return handledRef;
      });

      mockUseEffect.mockImplementation((callback) => callback());

      mockUseActionState.mockReturnValue([
        { success: true, message: "Book created successfully" },
        mockFormAction,
        false,
      ]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(mockAddToast).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Image Handling", () => {
    it("should handle image file selection", async () => {
      const user = userEvent.setup();
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      const fileInput = screen.getByTestId("file-input");
      await user.upload(fileInput, mockFile);

      expect(defaultSetSelectedFile).toHaveBeenCalledWith(mockFile);
    });

    it("should handle null file selection", () => {
      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      const fileInput = screen.getByTestId("file-input");

      Object.defineProperty(fileInput, "files", {
        value: null,
        writable: false,
      });

      fireEvent.change(fileInput);

      expect(defaultSetSelectedFile).toHaveBeenCalledWith(null);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty categories list", () => {
      render(<CreateBookForm onClose={mockOnClose} categories={[]} />);

      const categorySelect = screen.getByLabelText("Category *");
      expect(categorySelect).toBeInTheDocument();

      const options = categorySelect.querySelectorAll("option");
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveValue("");
    });

    it("should handle complex error objects", () => {
      const complexError = {
        title: ["Title is required", "Title must be at least 3 characters"],
        price: ["Price is invalid"],
      };

      mockUseActionState.mockReturnValue([
        { success: false, error: complexError },
        mockFormAction,
        false,
      ]);

      render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

      expect(screen.getByTestId("error-title")).toHaveTextContent("Title is required");
      expect(screen.getByTestId("error-price")).toHaveTextContent("Price is invalid");
    });
  });
});
