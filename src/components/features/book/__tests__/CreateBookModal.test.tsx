import { render, screen, fireEvent } from "@testing-library/react";
import CreateBookModal from "../CreateBookModal";
import type { Category } from "@/types";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, ...props }: any) {
    const { variant, ...domProps } = props;
    return (
      <button onClick={onPress} data-testid="add-button" data-variant={variant} {...domProps}>
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/Modal", () => ({
  Modal: function MockModal({ children, isOpen, title, ...props }: any) {
    const { size, color, scrollBehavior, description, onOpenChange, ...domProps } = props;
    return isOpen ? (
      <div data-testid="modal" data-title={title} {...domProps}>
        {children}
      </div>
    ) : null;
  },
  useModal: jest.fn(),
}));

jest.mock("../CreateBookForm", () => {
  return function MockCreateBookForm({ categories, onClose }: any) {
    return (
      <div data-testid="create-form">
        <span data-testid="categories-count">{categories.length}</span>
        <button onClick={onClose} data-testid="close-btn">
          Close
        </button>
      </div>
    );
  };
});

describe("CreateBookModal", () => {
  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: false,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });
  });

  it("renders add button and opens modal when clicked", () => {
    render(<CreateBookModal categories={mockCategories} />);

    const button = screen.getByTestId("add-button");
    expect(button).toHaveTextContent("Add New Book");
    expect(button).toHaveAttribute("data-variant", "primary");

    fireEvent.click(button);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it("shows modal when open with create form", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    render(<CreateBookModal categories={mockCategories} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toHaveAttribute("data-title", "Add New Book");
    expect(screen.getByTestId("create-form")).toBeInTheDocument();
    expect(screen.getByTestId("categories-count")).toHaveTextContent("2");
  });

  it("does not show modal when closed", () => {
    render(<CreateBookModal categories={mockCategories} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("handles form close action", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    render(<CreateBookModal categories={mockCategories} />);

    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles empty categories", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    render(<CreateBookModal categories={[]} />);
    expect(screen.getByTestId("categories-count")).toHaveTextContent("0");
  });
});
