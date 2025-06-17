import { render, screen, fireEvent } from "@testing-library/react";
import EditBookModal from "../EditBookModal";
import type { Book, Category } from "@/types";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, size, color, variant, fullWidth }: any) {
    return (
      <button
        onClick={onPress}
        data-testid="trigger-button"
        data-size={size}
        data-color={color}
        data-variant={variant}
        data-full-width={fullWidth}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@heroui/react", () => ({
  Modal: function MockModal({ children, isOpen, placement, onOpenChange }: any) {
    return isOpen ? (
      <div data-testid="modal" data-placement={placement}>
        {typeof children === "function" ? children(jest.fn()) : children}
        <button data-testid="modal-close" onClick={() => onOpenChange(false)}>
          Close Modal
        </button>
      </div>
    ) : null;
  },
  ModalContent: function MockModalContent({ children }: any) {
    return (
      <div data-testid="modal-content">
        {typeof children === "function" ? children(jest.fn()) : children}
      </div>
    );
  },
  ModalHeader: function MockModalHeader({ children, className }: any) {
    return (
      <div data-testid="modal-header" className={className}>
        {children}
      </div>
    );
  },
  ModalBody: function MockModalBody({ children }: any) {
    return <div data-testid="modal-body">{children}</div>;
  },
  useDisclosure: jest.fn(() => ({
    isOpen: false,
    onOpen: jest.fn(),
    onOpenChange: jest.fn(),
  })),
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
      <div data-testid="edit-book-form">
        <div data-testid="form-book-id">{book.documentId}</div>
        <div data-testid="form-pending-state">{isPending.toString()}</div>
        <button data-testid="form-close-button" onClick={onClose}>
          Form Close
        </button>
        <button data-testid="form-submit-button" onClick={() => formAction(new FormData())}>
          Form Submit
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

  const mockFormAction = jest.fn();

  const defaultProps = {
    book: mockBook,
    categories: mockCategories,
    formAction: mockFormAction,
    isPending: false,
    result: undefined,
  };

  let mockUseDisclosure: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseDisclosure = require("@heroui/react").useDisclosure;
    mockUseDisclosure.mockReturnValue({
      isOpen: false,
      onOpen: jest.fn(),
      onOpenChange: jest.fn(),
    });
  });

  describe("Component Rendering", () => {
    it("should render trigger button", () => {
      render(<EditBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveTextContent("Edit");
    });

    it("should not render modal when closed", () => {
      render(<EditBookModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal when open", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<EditBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("edit-book-form")).toBeInTheDocument();
    });
  });

  describe("Modal Interaction", () => {
    it("should call onOpen when trigger button is clicked", () => {
      const mockOnOpen = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: jest.fn(),
      });

      render(<EditBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      fireEvent.click(triggerButton);

      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("Form Integration", () => {
    beforeEach(() => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });
    });

    it("should call formAction when form triggers submit", () => {
      render(<EditBookModal {...defaultProps} />);

      const formSubmitButton = screen.getByTestId("form-submit-button");
      fireEvent.click(formSubmitButton);

      expect(mockFormAction).toHaveBeenCalledTimes(1);
    });

    it("should pass correct props to EditBookForm", () => {
      render(<EditBookModal {...defaultProps} />);

      expect(screen.getByTestId("form-book-id")).toHaveTextContent("doc-123");
      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("false");
    });
  });
});
