import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  DeleteItemButton,
  getBookId,
  getCartItemId,
  createRemoveAction,
  handleOptimisticUpdate,
  getButtonProps,
  REMOVE_BUTTON_TEXT,
  type OptimisticUpdateFn,
} from "../DeleteItemButton";
import type { CartItem } from "@/types";

const mockFormAction = jest.fn();
const mockUseActionState = jest.fn();

jest.mock("@/app/actions", () => ({
  removeItem: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (...args: any[]) => mockUseActionState(...args),
  useCallback: jest.fn().mockImplementation((fn: any) => fn),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    onClick,
    type,
    variant,
    color,
    size,
    fullWidth,
    ...props
  }: any) {
    return (
      <button
        onClick={onClick}
        type={type}
        data-testid="delete-button"
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-full-width={fullWidth}
        {...props}
      >
        {children}
      </button>
    );
  },
}));

describe("DeleteItemButton", () => {
  const mockCartItem: CartItem = {
    id: "cart-item-1",
    documentId: "doc-cart-item-1",
    quantity: 2,
    book: {
      id: "book-1",
      documentId: "doc-book-1",
      slug: "test-book",
      title: "Test Book",
      description: "A test book",
      price: 29.99,
      language: "English",
      imageUrl: "/test-image.jpg",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
      publishedAt: "2023-01-01T00:00:00.000Z",
      categories: [],
    },
  };

  const mockOptimisticUpdate: OptimisticUpdateFn = jest.fn();

  beforeEach(() => {
    mockUseActionState.mockReturnValue([null, mockFormAction, false]);
    jest.clearAllMocks();
  });

  describe("Helper Functions", () => {
    describe("getBookId", () => {
      it("should return book ID when book exists", () => {
        const result = getBookId(mockCartItem);
        expect(result).toBe("book-1");
      });

      it("should return empty string when book is null", () => {
        const itemWithoutBook = { ...mockCartItem, book: null };
        const result = getBookId(itemWithoutBook as any);
        expect(result).toBe("");
      });

      it("should return empty string when book is undefined", () => {
        const itemWithoutBook = { ...mockCartItem, book: undefined };
        const result = getBookId(itemWithoutBook as any);
        expect(result).toBe("");
      });

      it("should return empty string when book ID is missing", () => {
        const itemWithoutBookId = {
          ...mockCartItem,
          book: { ...mockCartItem.book, id: undefined },
        };
        const result = getBookId(itemWithoutBookId as any);
        expect(result).toBe("");
      });
    });

    describe("getCartItemId", () => {
      it("should return document ID when it exists", () => {
        const result = getCartItemId(mockCartItem);
        expect(result).toBe("doc-cart-item-1");
      });

      it("should return empty string when document ID is missing", () => {
        const itemWithoutDocId = { ...mockCartItem, documentId: undefined };
        const result = getCartItemId(itemWithoutDocId);
        expect(result).toBe("");
      });

      it("should return empty string when document ID is null", () => {
        const itemWithoutDocId = { ...mockCartItem, documentId: null };
        const result = getCartItemId(itemWithoutDocId as any);
        expect(result).toBe("");
      });
    });

    describe("createRemoveAction", () => {
      it("should bind form action with cart item ID", () => {
        const mockBind = jest.fn().mockReturnValue("bound-action");
        const mockAction = { bind: mockBind };

        const result = createRemoveAction(mockAction, "test-cart-item-id");

        expect(mockBind).toHaveBeenCalledWith(null, "test-cart-item-id");
        expect(result).toBe("bound-action");
      });
    });

    describe("handleOptimisticUpdate", () => {
      it("should call optimistic update with correct parameters", () => {
        const mockUpdate = jest.fn();

        handleOptimisticUpdate(mockUpdate, "book-123");

        expect(mockUpdate).toHaveBeenCalledWith("book-123", "delete");
      });
    });

    describe("getButtonProps", () => {
      it("should return correct button properties", () => {
        const props = getButtonProps();

        expect(props).toEqual({
          type: "submit",
          variant: "light",
          color: "default",
          size: "lg",
          fullWidth: true,
        });
      });
    });
  });

  describe("Component Rendering", () => {
    it("should render delete button with correct text", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(REMOVE_BUTTON_TEXT);
    });

    it("should render button with correct properties", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("data-variant", "light");
      expect(button).toHaveAttribute("data-color", "default");
      expect(button).toHaveAttribute("data-size", "lg");
      expect(button).toHaveAttribute("data-full-width", "true");
    });

    it("should render status message element", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const statusElement = screen.getByRole("status");
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveClass("sr-only");
      expect(statusElement).toHaveAttribute("aria-live", "polite");
    });

    it("should display message in status element when present", () => {
      mockUseActionState.mockReturnValue(["Error occurred", mockFormAction, false]);

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const statusElement = screen.getByRole("status");
      expect(statusElement).toHaveTextContent("Error occurred");
    });
  });

  describe("Form Submission", () => {
    it("should call optimistic update on form submission", async () => {
      const handleFormSubmit = jest.fn();
      const { useCallback } = require("react");
      useCallback.mockImplementation((fn: any) => {
        handleFormSubmit.mockImplementation(fn);
        return handleFormSubmit;
      });

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const form = screen.getByTestId("delete-button").closest("form");
      expect(form).toBeInTheDocument();

      handleFormSubmit();

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "delete");
    });

    it("should use default removeItem action when no override provided", () => {
      const { removeItem } = require("@/app/actions");

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(mockUseActionState).toHaveBeenCalledWith(removeItem, null);
    });

    it("should use custom remove action when override provided", () => {
      const customRemoveAction = jest.fn();

      render(
        <DeleteItemButton
          item={mockCartItem}
          optimisticUpdate={mockOptimisticUpdate}
          onRemoveOverride={customRemoveAction}
        />
      );

      expect(mockUseActionState).toHaveBeenCalledWith(customRemoveAction, null);
    });
  });

  describe("Action Binding", () => {
    it("should bind form action with correct cart item ID", () => {
      mockFormAction.bind = jest.fn().mockReturnValue("bound-action");

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(mockFormAction.bind).toHaveBeenCalledWith(null, "doc-cart-item-1");
    });

    it("should handle empty cart item ID", () => {
      const itemWithoutDocId = { ...mockCartItem, documentId: undefined };
      mockFormAction.bind = jest.fn().mockReturnValue("bound-action");

      render(<DeleteItemButton item={itemWithoutDocId} optimisticUpdate={mockOptimisticUpdate} />);

      expect(mockFormAction.bind).toHaveBeenCalledWith(null, "");
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart item without book gracefully", () => {
      const itemWithoutBook = { ...mockCartItem, book: null };

      render(
        <DeleteItemButton item={itemWithoutBook as any} optimisticUpdate={mockOptimisticUpdate} />
      );

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
    });

    it("should handle missing documentId gracefully", () => {
      const itemWithoutDocId = { ...mockCartItem, documentId: undefined };

      render(<DeleteItemButton item={itemWithoutDocId} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
    });

    it("should handle undefined book properties", () => {
      const itemWithPartialBook = {
        ...mockCartItem,
        book: {
          ...mockCartItem.book,
          id: undefined,
        },
      };

      render(
        <DeleteItemButton
          item={itemWithPartialBook as any}
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form structure", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const form = screen.getByTestId("delete-button").closest("form");
      const button = screen.getByTestId("delete-button");

      expect(form).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should have proper aria-live region for status updates", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const statusElement = screen.getByRole("status");
      expect(statusElement).toHaveAttribute("aria-live", "polite");
      expect(statusElement).toHaveClass("sr-only");
    });
  });
});
