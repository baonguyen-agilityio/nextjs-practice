import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteBookModal from "../DeleteBookModal";
import type { Book } from "@/types";

let currentOnOpenChange: any = null;

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
    const handleClose = () => onOpenChange(false);
    currentOnOpenChange = onOpenChange;

    return isOpen ? (
      <div data-testid="modal" data-placement={placement}>
        {children}
        <button data-testid="modal-close" onClick={handleClose}>
          Close Modal
        </button>
      </div>
    ) : null;
  },
  ModalContent: function MockModalContent({ children }: any) {
    const onClose = () => {
      if (currentOnOpenChange) {
        currentOnOpenChange(false);
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
  useDisclosure: jest.fn(() => ({
    isOpen: false,
    onOpen: jest.fn(),
    onOpenChange: jest.fn(),
  })),
}));

jest.mock("../DeleteBookForm", () => {
  return function MockDeleteBookForm({ book, onClose, formActionDelete, isPendingDelete }: any) {
    return (
      <div data-testid="delete-book-form">
        <div data-testid="form-book-id">{book?.documentId || "undefined"}</div>
        <div data-testid="form-pending-state">{isPendingDelete.toString()}</div>
        <button data-testid="form-close-button" onClick={() => onClose && onClose()}>
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

  const defaultProps = {
    book: mockBook,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
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
      render(<DeleteBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveTextContent("Delete");
    });

    it("should render trigger button with correct props", () => {
      render(<DeleteBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toHaveAttribute("data-size", "lg");
      expect(triggerButton).toHaveAttribute("data-color", "danger");
      expect(triggerButton).toHaveAttribute("data-variant", "ghost");
      expect(triggerButton).toHaveAttribute("data-full-width", "true");
    });

    it("should not render modal when closed", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal when open", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toBeInTheDocument();
      expect(screen.getByTestId("modal-body")).toBeInTheDocument();
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

      render(<DeleteBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      fireEvent.click(triggerButton);

      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });

    it("should call onOpenChange when modal is closed", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Modal Content", () => {
    beforeEach(() => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });
    });

    it("should render modal header with correct title", () => {
      render(<DeleteBookModal {...defaultProps} />);

      const modalHeader = screen.getByTestId("modal-header");
      expect(modalHeader).toHaveTextContent("Delete book");
      expect(modalHeader).toHaveClass("flex", "flex-col", "gap-1");
    });

    it("should render DeleteBookForm in modal body", () => {
      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal-body")).toBeInTheDocument();
      expect(screen.getByTestId("delete-book-form")).toBeInTheDocument();
    });

    it("should pass correct props to DeleteBookForm", () => {
      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("form-book-id")).toHaveTextContent("doc-123");
      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("false");
    });

    it("should pass isPendingDelete state to DeleteBookForm", () => {
      render(<DeleteBookModal {...defaultProps} isPendingDelete={true} />);

      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("true");
    });

    it("should render modal with correct placement", () => {
      render(<DeleteBookModal {...defaultProps} />);

      const modal = screen.getByTestId("modal");
      expect(modal).toHaveAttribute("data-placement", "top-center");
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

    it("should call formActionDelete when form triggers delete", () => {
      render(<DeleteBookModal {...defaultProps} />);

      const formDeleteButton = screen.getByTestId("form-delete-button");
      fireEvent.click(formDeleteButton);

      expect(mockFormActionDelete).toHaveBeenCalledTimes(1);
      expect(mockFormActionDelete).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("should handle form close button click", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      const formCloseButton = screen.getByTestId("form-close-button");
      fireEvent.click(formCloseButton);

      expect(mockOnOpenChange).toHaveBeenCalled();
    });

    it("should handle form action errors gracefully", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

      const failingFormAction = jest.fn(() => {
        console.error("Delete failed");
      });

      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} formActionDelete={failingFormAction} />);

      const formDeleteButton = screen.getByTestId("form-delete-button");

      fireEvent.click(formDeleteButton);

      expect(failingFormAction).toHaveBeenCalledWith(expect.any(FormData));
      expect(consoleError).toHaveBeenCalledWith("Delete failed");

      consoleError.mockRestore();
    });
  });

  describe("State Management", () => {
    it("should handle modal state transitions", async () => {
      const mockOnOpen = jest.fn();
      const mockOnOpenChange = jest.fn();

      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      const { rerender } = render(<DeleteBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("trigger-button"));
      expect(mockOnOpen).toHaveBeenCalled();

      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      rerender(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should maintain pending state across modal operations", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      const { rerender } = render(<DeleteBookModal {...defaultProps} isPendingDelete={false} />);

      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("false");

      rerender(<DeleteBookModal {...defaultProps} isPendingDelete={true} />);

      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("true");
    });
  });

  describe("Edge Cases", () => {
    it("should handle book with different data structures", () => {
      const specialBook = {
        ...mockBook,
        documentId: "special-doc-456",
        title: "Special Book with Long Title & Special Characters!",
      };

      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} book={specialBook} />);

      expect(screen.getByTestId("form-book-id")).toHaveTextContent("special-doc-456");
    });

    it("should handle multiple rapid trigger button clicks", () => {
      const mockOnOpen = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);

      expect(mockOnOpen).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    it("should have accessible trigger button", () => {
      render(<DeleteBookModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      expect(triggerButton).toBeInTheDocument();
    });

    it("should maintain focus management in modal", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toBeInTheDocument();
    });

    it("should provide clear action context", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal-header")).toHaveTextContent("Delete book");
    });
  });

  describe("Props Validation", () => {
    it("should handle required props correctly", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("trigger-button")).toBeInTheDocument();
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("delete-book-form")).toBeInTheDocument();
    });

    it("should handle undefined book gracefully", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      const propsWithUndefinedBook = {
        ...defaultProps,
        book: undefined as any,
      };

      expect(() => {
        render(<DeleteBookModal {...propsWithUndefinedBook} />);
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("should not render modal content when closed", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<DeleteBookModal {...defaultProps} />);

      expect(screen.getByTestId("trigger-button")).toBeInTheDocument();
      expect(screen.queryByTestId("delete-book-form")).not.toBeInTheDocument();
    });

    it("should efficiently handle state updates", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<DeleteBookModal {...defaultProps} />);

      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(2);
    });
  });
});
