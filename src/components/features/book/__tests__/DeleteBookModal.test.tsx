import { render, screen, fireEvent } from "@testing-library/react";
import DeleteBookModal from "../DeleteBookModal";
import type { Book } from "@/types";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, variant, fullWidth, ...props }: any) {
    const { color, isLoading, isDisabled, size, ...domProps } = props;
    return (
      <button
        onClick={onPress}
        data-testid="delete-button"
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

jest.mock("../DeleteBookForm", () => {
  return function MockDeleteBookForm({ book, onClose, formActionDelete, isPendingDelete }: any) {
    return (
      <div data-testid="delete-form">
        <span data-testid="book-id">{book.documentId}</span>
        <span data-testid="pending">{isPendingDelete.toString()}</span>
        <button onClick={onClose} data-testid="close-btn">
          Close
        </button>
        <button onClick={() => formActionDelete(new FormData())} data-testid="submit-btn">
          Delete
        </button>
      </div>
    );
  };
});

describe("DeleteBookModal", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-123",
    slug: "test-book",
    title: "Test Book Title",
    price: 19.99,
    language: "en",
    description: "A test book description",
    imageUrl: "/test-book.jpg",
    categories: [],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockFormActionDelete = jest.fn();
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    book: mockBook,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  };

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

  it("renders delete button and opens modal when clicked", () => {
    render(<DeleteBookModal {...defaultProps} />);

    const button = screen.getByTestId("delete-button");
    expect(button).toHaveTextContent("Delete");

    fireEvent.click(button);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it("shows modal when open with delete form", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    render(<DeleteBookModal {...defaultProps} isPendingDelete={true} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toHaveAttribute("data-title", "Delete book");
    expect(screen.getByTestId("delete-form")).toBeInTheDocument();
    expect(screen.getByTestId("book-id")).toHaveTextContent("doc-123");
    expect(screen.getByTestId("pending")).toHaveTextContent("true");
  });

  it("does not show modal when closed", () => {
    render(<DeleteBookModal {...defaultProps} />);
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

    render(<DeleteBookModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles form delete action", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    render(<DeleteBookModal {...defaultProps} />);

    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));
  });
});
