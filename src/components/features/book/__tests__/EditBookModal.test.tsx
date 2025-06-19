import { render, screen, fireEvent } from "@testing-library/react";
import EditBookModal from "../EditBookModal";
import type { Book, Category } from "@/types";

let mockOnOpenChange: any = null;

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
  const mockOnOpen = jest.fn();
  const mockOnOpenChangeFunc = jest.fn();

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
  });

  describe("Trigger Button", () => {
    it("should render trigger button with correct props and open modal when clicked", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChangeFunc,
      });

      render(<EditBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveTextContent("Edit");
      expect(triggerButton).toHaveAttribute("data-size", "lg");
      expect(triggerButton).toHaveAttribute("data-color", "primary");
      expect(triggerButton).toHaveAttribute("data-variant", "ghost");
      expect(triggerButton).toHaveAttribute("data-full-width", "true");

      fireEvent.click(triggerButton);
      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe("Modal Rendering", () => {
    it("should not render modal when closed", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChangeFunc,
      });

      render(<EditBookModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal with correct structure when open", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChangeFunc,
      });

      render(<EditBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal")).toHaveAttribute("data-placement", "top-center");
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toBeInTheDocument();
      expect(screen.getByTestId("modal-body")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toHaveTextContent("Edit book");
      expect(screen.getByTestId("edit-book-form")).toBeInTheDocument();
    });
  });

  describe("EditBookForm Integration", () => {
    beforeEach(() => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChangeFunc,
      });
    });

    it("should pass correct props to EditBookForm and handle form actions", () => {
      render(<EditBookModal {...defaultProps} />);

      expect(screen.getByTestId("form-book-id")).toHaveTextContent("doc-123");
      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("false");

      fireEvent.click(screen.getByTestId("form-submit-button"));
      expect(mockFormAction).toHaveBeenCalledTimes(1);
      expect(mockFormAction).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("should handle form close action", () => {
      render(<EditBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("form-close-button"));
      expect(mockOnOpenChangeFunc).toHaveBeenCalledWith(false);
    });

    it("should pass isPending state to form", () => {
      render(<EditBookModal {...defaultProps} isPending={true} />);

      expect(screen.getByTestId("form-pending-state")).toHaveTextContent("true");
    });
  });
});
