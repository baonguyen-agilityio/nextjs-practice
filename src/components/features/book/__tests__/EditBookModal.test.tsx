import { render, screen, fireEvent } from "@testing-library/react";
import EditBookModal from "../EditBookModal";
import type { Book, Category } from "@/types";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, size, variant, fullWidth, ...props }: any) {
    const { color, isLoading, isDisabled, ...domProps } = props;
    return (
      <button
        onClick={onPress}
        data-testid="trigger-button"
        data-size={size}
        data-variant={variant}
        data-full-width={fullWidth}
        {...domProps}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/Modal", () => ({
  Modal: function MockModal({ children, isOpen, title, onOpenChange, ...props }: any) {
    const { size, onClose, ...domProps } = props;
    return isOpen ? (
      <div data-testid="modal" data-title={title} {...domProps}>
        {children}
      </div>
    ) : null;
  },
  useModal: jest.fn(),
}));

jest.mock("../EditBookForm", () => {
  return function MockEditBookForm({
    book,
    onClose,
    categories,
    formAction,
    isPending,
    result,
  }: any) {
    return (
      <div data-testid="edit-form">
        <span data-testid="book-id">{book.documentId}</span>
        <span data-testid="pending">{isPending.toString()}</span>
        <button onClick={onClose} data-testid="close-btn">
          Close
        </button>
        <button onClick={() => formAction(new FormData())} data-testid="submit-btn">
          Submit
        </button>
      </div>
    );
  };
});

describe("EditBookModal", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-123",
    slug: "test-book",
    title: "Test Book",
    price: 19.99,
    language: "en",
    description: "Test description",
    imageUrl: "/test.jpg",
    categories: [{ id: 1, documentId: "cat-1", name: "Fiction" }],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
  ];

  const mockFormAction = jest.fn();
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    book: mockBook,
    categories: mockCategories,
    formAction: mockFormAction,
    isPending: false,
    result: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: false,
      onOpen: mockOnOpen,
      onOpenChange: mockOnOpenChange,
      onClose: mockOnClose,
    });
  });

  it("renders trigger button and opens modal when clicked", () => {
    render(<EditBookModal {...defaultProps} />);

    const button = screen.getByTestId("trigger-button");
    expect(button).toHaveTextContent("Edit");

    fireEvent.click(button);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it("shows modal when open and passes correct props to form", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onOpenChange: mockOnOpenChange,
      onClose: mockOnClose,
    });

    render(<EditBookModal {...defaultProps} isPending={true} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toHaveAttribute("data-title", "Edit book");
    expect(screen.getByTestId("edit-form")).toBeInTheDocument();
    expect(screen.getByTestId("book-id")).toHaveTextContent("doc-123");
    expect(screen.getByTestId("pending")).toHaveTextContent("true");
  });

  it("does not show modal when closed", () => {
    render(<EditBookModal {...defaultProps} />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("handles form close action", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onOpenChange: mockOnOpenChange,
      onClose: mockOnClose,
    });

    render(<EditBookModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles form submit action", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onOpenChange: mockOnOpenChange,
      onClose: mockOnClose,
    });

    render(<EditBookModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
  });
});
