import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteItemButton } from "../DeleteItemButton";
import type { CartItem } from "@/types";

const mockFormAction = jest.fn();
const mockUseActionState = jest.fn();
const mockOptimisticUpdate = jest.fn();

jest.mock("@/app/actions", () => ({
  removeItem: jest.fn(),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (...args: any[]) => mockUseActionState(...args),
  useCallback: jest.fn().mockImplementation((fn: any) => fn),
  useEffect: jest.fn(),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    type,
    variant,
    color,
    disabled,
    isLoading,
    "aria-label": ariaLabel,
    ...props
  }: any) {
    return (
      <button
        type={type}
        disabled={disabled || isLoading}
        data-testid="delete-button"
        data-variant={variant}
        data-color={color}
        data-loading={isLoading}
        aria-label={ariaLabel}
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

  beforeEach(() => {
    mockUseActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, false]);
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render delete button with correct properties", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Remove");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("data-variant", "text");
      expect(button).toHaveAttribute("aria-label", "Remove item from cart");
    });

    it("should show loading state when pending", () => {
      mockUseActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, true]);

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Form Submission", () => {
    it("should initialize with correct action and state", () => {
      const { removeItem } = require("@/app/actions");

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(mockUseActionState).toHaveBeenCalledWith(removeItem, {
        success: null,
        message: "",
      });
    });

    it("should call optimistic update on form submit", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "delete");
    });
  });

  describe("Toast Notifications", () => {
    it("should show success toast", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      mockUseActionState.mockReturnValue([
        { success: true, message: "Item removed successfully" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(addToast).toHaveBeenCalledWith({
        title: "Item removed successfully",
        color: "success",
      });
    });

    it("should show error toast", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      mockUseActionState.mockReturnValue([
        { success: false, message: "Failed to remove item" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(addToast).toHaveBeenCalledWith({
        title: "Failed to remove item",
        color: "danger",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle item without book", () => {
      const itemWithoutBook = { ...mockCartItem, book: null };

      render(
        <DeleteItemButton item={itemWithoutBook as any} optimisticUpdate={mockOptimisticUpdate} />
      );

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("", "delete");
    });

    it("should handle item without documentId", () => {
      const itemWithoutDocId = { ...mockCartItem, documentId: "" };

      render(<DeleteItemButton item={itemWithoutDocId} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
    });
  });
});
