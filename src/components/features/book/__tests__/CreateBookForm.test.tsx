import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBookForm from "../CreateBookForm";
import type { Category } from "@/types";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn().mockReturnValue([undefined, jest.fn(), false]),
  useRef: jest.fn().mockReturnValue({ current: null }),
  useState: jest.fn().mockImplementation((initial) => [initial, jest.fn()]),
  useEffect: jest.fn(),
  startTransition: jest.fn((fn) => fn()),
}));

jest.mock("@/app/actions/book", () => ({
  createBook: jest.fn(),
}));

jest.mock("@/components/ui/Input", () => ({
  Input: ({ label, name, type, isRequired, errorMessage, ...props }: any) => (
    <div>
      <label htmlFor={name}>
        {label} {isRequired && "*"}
      </label>
      <input id={name} name={name} type={type} required={isRequired} {...props} />
      {errorMessage && <span className="error">{errorMessage}</span>}
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
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@heroui/react", () => ({
  Form: ({ children, onSubmit, ...props }: any) => (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  ),
  Select: ({ name, label, placeholder, isRequired, children, ...props }: any) => (
    <div>
      <label htmlFor={name}>
        {label} {isRequired && "*"}
      </label>
      <select id={name} name={name} required={isRequired} {...props}>
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  ),
  SelectItem: ({ children, ...props }: any) => <option {...props}>{children}</option>,
}));

jest.mock("@/components/features/book/ImagePicker", () => ({
  __esModule: true,
  default: ({ onFileChange }: any) => (
    <div>
      <label htmlFor="image">Image Upload</label>
      <input id="image" type="file" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
    </div>
  ),
}));

describe("CreateBookForm", () => {
  const mockOnClose = jest.fn();
  const mockCategories: Category[] = [
    { id: 1, name: "Fiction", documentId: "doc-1" },
    { id: 2, name: "Non-Fiction", documentId: "doc-2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all form fields", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Price *")).toBeInTheDocument();
    expect(screen.getByLabelText("Language")).toBeInTheDocument();
    expect(screen.getByLabelText("Description *")).toBeInTheDocument();
    expect(screen.getByLabelText("Category *")).toBeInTheDocument();
    expect(screen.getByLabelText(/image upload/i)).toBeInTheDocument();
  });

  it("should mark required fields with asterisk", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    expect(screen.getByLabelText("Title *")).toHaveAttribute("required");
    expect(screen.getByLabelText("Price *")).toHaveAttribute("required");
    expect(screen.getByLabelText("Description *")).toHaveAttribute("required");
    expect(screen.getByLabelText("Category *")).toHaveAttribute("required");

    expect(screen.getByLabelText("Language")).not.toHaveAttribute("required");
  });

  it("should have correct input types", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    expect(screen.getByLabelText("Title *")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Price *")).toHaveAttribute("type", "number");
    expect(screen.getByLabelText("Language")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Description *")).toHaveAttribute("type", "text");
  });

  it("should render category options", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const categorySelect = screen.getByLabelText("Category *");
    expect(categorySelect).toBeInTheDocument();

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Non-Fiction")).toBeInTheDocument();
  });

  it("should render action buttons", () => {
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<CreateBookForm onClose={mockOnClose} categories={mockCategories} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
