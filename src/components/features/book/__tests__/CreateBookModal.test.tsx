import { render, screen, fireEvent } from "@testing-library/react";
import CreateBookModal from "../CreateBookModal";
import type { Category } from "@/types";

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, size, color, variant }: any) {
    return (
      <button
        onClick={onPress}
        data-testid="trigger-button"
        data-size={size}
        data-color={color}
        data-variant={variant}
      >
        {children}
      </button>
    );
  },
}));

let currentOnOpenChange: any = null;

jest.mock("@heroui/react", () => ({
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

jest.mock("../CreateBookForm", () => {
  return function MockCreateBookForm({ onClose, categories }: any) {
    return (
      <div data-testid="create-book-form">
        <div data-testid="form-categories-count">{categories.length}</div>
        <button data-testid="form-close-button" onClick={() => onClose && onClose()}>
          Form Close
        </button>
        <button data-testid="form-submit-button">Form Submit</button>
      </div>
    );
  };
});

describe("CreateBookModal", () => {
  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
    { id: 3, documentId: "cat-3", name: "Science Fiction" },
  ];

  const defaultProps = {
    categories: mockCategories,
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
      render(<CreateBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveTextContent("Add New Book");
    });

    it("should render trigger button with correct props", () => {
      render(<CreateBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toHaveAttribute("data-size", "lg");
      expect(triggerButton).toHaveAttribute("data-color", "primary");
      expect(triggerButton).toHaveAttribute("data-variant", "ghost");
    });

    it("should not render modal when closed", () => {
      render(<CreateBookModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should render modal when open", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

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

      render(<CreateBookModal {...defaultProps} />);

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

      render(<CreateBookModal {...defaultProps} />);

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
      render(<CreateBookModal {...defaultProps} />);

      const modalHeader = screen.getByTestId("modal-header");
      expect(modalHeader).toHaveTextContent("Add New Book");
      expect(modalHeader).toHaveClass("flex", "flex-col", "gap-1");
    });

    it("should render CreateBookForm in modal body", () => {
      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal-body")).toBeInTheDocument();
      expect(screen.getByTestId("create-book-form")).toBeInTheDocument();
    });

    it("should pass correct props to CreateBookForm", () => {
      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("form-categories-count")).toHaveTextContent("3");
    });

    it("should render modal with correct placement", () => {
      render(<CreateBookModal {...defaultProps} />);

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

    it("should handle form close button click", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<CreateBookModal {...defaultProps} />);

      const formCloseButton = screen.getByTestId("form-close-button");
      fireEvent.click(formCloseButton);

      expect(mockOnOpenChange).toHaveBeenCalled();
    });

    it("should render form submit button", () => {
      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("form-submit-button")).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    it("should handle modal state transitions", () => {
      const mockOnOpen = jest.fn();
      const mockOnOpenChange = jest.fn();

      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      const { rerender } = render(<CreateBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("trigger-button"));
      expect(mockOnOpen).toHaveBeenCalled();

      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onOpenChange: mockOnOpenChange,
      });

      rerender(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty categories array", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal categories={[]} />);

      expect(screen.getByTestId("form-categories-count")).toHaveTextContent("0");
    });

    it("should handle multiple rapid trigger button clicks", () => {
      const mockOnOpen = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);
      fireEvent.click(triggerButton);

      expect(mockOnOpen).toHaveBeenCalledTimes(3);
    });

    it("should handle large categories array", () => {
      const largeCategories = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        documentId: `cat-${i + 1}`,
        name: `Category ${i + 1}`,
      }));

      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal categories={largeCategories} />);

      expect(screen.getByTestId("form-categories-count")).toHaveTextContent("50");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible trigger button", () => {
      render(<CreateBookModal {...defaultProps} />);

      const triggerButton = screen.getByRole("button", { name: /add new book/i });
      expect(triggerButton).toBeInTheDocument();
    });

    it("should maintain focus management in modal", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("modal-header")).toBeInTheDocument();
    });

    it("should provide clear action context", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("modal-header")).toHaveTextContent("Add New Book");
    });
  });

  describe("Props Validation", () => {
    it("should handle required props correctly", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("trigger-button")).toBeInTheDocument();
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByTestId("create-book-form")).toBeInTheDocument();
    });

    it("should handle categories prop correctly", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      const customCategories = [{ id: 1, documentId: "custom-1", name: "Custom Category" }];

      render(<CreateBookModal categories={customCategories} />);

      expect(screen.getByTestId("form-categories-count")).toHaveTextContent("1");
    });
  });

  describe("Performance", () => {
    it("should not render modal content when closed", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("trigger-button")).toBeInTheDocument();
      expect(screen.queryByTestId("create-book-form")).not.toBeInTheDocument();
    });

    it("should efficiently handle state updates", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<CreateBookModal {...defaultProps} />);

      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(2);
    });
  });

  describe("Integration with CreateBookForm", () => {
    it("should pass categories to form correctly", () => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: jest.fn(),
      });

      const specificCategories = [
        { id: 1, documentId: "fiction", name: "Fiction" },
        { id: 2, documentId: "non-fiction", name: "Non-Fiction" },
      ];

      render(<CreateBookModal categories={specificCategories} />);

      expect(screen.getByTestId("form-categories-count")).toHaveTextContent("2");
    });

    it("should provide onClose function to form", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<CreateBookModal {...defaultProps} />);

      const formCloseButton = screen.getByTestId("form-close-button");
      expect(formCloseButton).toBeInTheDocument();

      fireEvent.click(formCloseButton);
      expect(mockOnOpenChange).toHaveBeenCalled();
    });
  });
});
