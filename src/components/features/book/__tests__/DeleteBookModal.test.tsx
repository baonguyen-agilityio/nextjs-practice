import { render, screen, fireEvent } from "@testing-library/react";
import DeleteBookModal from "../DeleteBookModal";
import type { Book } from "@/types";

let mockOnOpenChange: any = null;

jest.mock("@heroui/react", () => ({
  Button: function MockButton({ children, onPress, size, color, variant, fullWidth }: any) {
    return (
      <button
        data-testid="trigger-button"
        onClick={onPress}
        data-size={size}
        data-color={color}
        data-variant={variant}
        data-full-width={fullWidth}
      >
        {children}
      </button>
    );
  },
  Modal: function MockModal({ children, isOpen, placement, onOpenChange }: any) {
    mockOnOpenChange = onOpenChange;
    return isOpen ? (
      <div data-testid="modal" data-placement={placement}>
        {children}
      </div>
    ) : null;
  },
  ModalContent: function MockModalContent({ children }: any) {
    const onClose = () => {
      if (mockOnOpenChange) {
        mockOnOpenChange(false);
      }
    };
    return (
      <div data-testid="modal-content">
        {typeof children === "function" ? children(onClose) : children}
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
  useDisclosure: jest.fn(),
}));

jest.mock("../DeleteBookForm", () => {
  return function MockDeleteBookForm({ book, onClose, formActionDelete, isPendingDelete }: any) {
    return (
      <div data-testid="delete-book-form">
        <div data-testid="form-book-id">{book?.documentId}</div>
        <div data-testid="form-pending-state">{isPendingDelete.toString()}</div>
        <button data-testid="form-close-button" onClick={onClose}>
          Form Close
        </button>
        <button data-testid="form-delete-button" onClick={() => formActionDelete(new FormData())}>
          Form Delete
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
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    book: mockBook,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  };

  let mockUseDisclosure: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDisclosure = require("@heroui/react").useDisclosure;
  });

  describe("Trigger Button", () => {
    it("should render trigger button with correct props", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveTextContent("Delete");
      expect(triggerButton).toHaveAttribute("data-size", "lg");
      expect(triggerButton).toHaveAttribute("data-color", "danger");
      expect(triggerButton).toHaveAttribute("data-variant", "ghost");
      expect(triggerButton).toHaveAttribute("data-full-width", "true");
    });

    it("should open modal when trigger button is clicked", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("trigger-button"));
      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("Modal Rendering", () => {
    it("should not render modal when closed", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal with correct structure when open", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal")).toHaveAttribute("data-placement", "top-center");
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toBeInTheDocument();
      expect(screen.getByTestId("modal-body")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toHaveTextContent("Delete book");
    });
  });

  describe("DeleteBookForm Integration", () => {
    beforeEach(() => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });
    });

    it("should render DeleteBookForm with correct props", () => {
      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("delete-book-form")).toBeInTheDocument();
      expect(screen.getByTestId("form-book-id")).toHaveTextContent("doc-123");
      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("false");
    });

    it("should pass isPendingDelete state to form", () => {
      render(<DeleteBookModal {...defaultProps} isPendingDelete={true} />);

      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("true");
    });

    it("should handle form close action", () => {
      render(<DeleteBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("form-close-button"));
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should handle form delete action", () => {
      render(<DeleteBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("form-delete-button"));
      expect(mockFormActionDelete).toHaveBeenCalledTimes(1);
      expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));
    });
  });
});
