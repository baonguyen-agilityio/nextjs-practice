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
      </div>
    );
  };
});

describe("CreateBookModal", () => {
  const mockCategories: Category[] = [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Mystery" },
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
    it("should render trigger button with correct text and props", () => {
      render(<CreateBookModal {...defaultProps} />);

      const triggerButton = screen.getByTestId("trigger-button");
      expect(triggerButton).toBeInTheDocument();
      expect(triggerButton).toHaveTextContent("Add New Book");
      expect(triggerButton).toHaveAttribute("data-size", "lg");
      expect(triggerButton).toHaveAttribute("data-color", "primary");
      expect(triggerButton).toHaveAttribute("data-variant", "ghost");
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
      expect(screen.getByTestId("modal")).toHaveAttribute("data-placement", "top-center");
    });

    it("should not render modal when closed", () => {
      render(<CreateBookModal {...defaultProps} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    it("should open modal when trigger button is clicked", () => {
      const mockOnOpen = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onOpenChange: jest.fn(),
      });

      render(<CreateBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("trigger-button"));
      expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });

    it("should close modal when close button is clicked", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<CreateBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("modal-close"));
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
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

    it("should render CreateBookForm with correct props", () => {
      render(<CreateBookModal {...defaultProps} />);

      expect(screen.getByTestId("create-book-form")).toBeInTheDocument();
      expect(screen.getByTestId("form-categories-count")).toHaveTextContent("2");
    });

    it("should close modal when form triggers onClose", () => {
      const mockOnOpenChange = jest.fn();
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: jest.fn(),
        onOpenChange: mockOnOpenChange,
      });

      render(<CreateBookModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("form-close-button"));
      expect(mockOnOpenChange).toHaveBeenCalled();
    });

    it("should render modal header with correct title", () => {
      render(<CreateBookModal {...defaultProps} />);

      const modalHeader = screen.getByTestId("modal-header");
      expect(modalHeader).toHaveTextContent("Add New Book");
      expect(modalHeader).toHaveClass("flex", "flex-col", "gap-1");
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
  });
});
