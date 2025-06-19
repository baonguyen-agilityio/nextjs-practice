import { render, screen, fireEvent } from "@testing-library/react";
import { EditItemQuantityButton } from "../EditItemQuantityButton";
import type { CartItem } from "@/types";

const mockOptimisticUpdate = jest.fn();
const mockFormAction = jest.fn();
const mockUseActionState = jest.fn();

jest.mock("@/app/actions/cart", () => ({
  updateItemQuantity: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: (...args: any[]) => mockUseActionState(...args),
  useEffect: jest.fn(),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    size,
    variant,
    isIconOnly,
    radius,
    type,
    isLoading,
    disableAnimation,
    "aria-label": ariaLabel,
    ...props
  }: any) {
    return (
      <button
        type={type}
        data-testid="quantity-button"
        data-size={size}
        data-variant={variant}
        data-icon-only={isIconOnly}
        data-radius={radius}
        data-loading={isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/icons/PlusIcon", () => {
  return function MockPlusIcon({ className }: any) {
    return (
      <div data-testid="plus-icon" className={className}>
        +
      </div>
    );
  };
});

jest.mock("@/components/icons/MinusIcon", () => {
  return function MockMinusIcon({ className }: any) {
    return (
      <div data-testid="minus-icon" className={className}>
        -
      </div>
    );
  };
});

describe("EditItemQuantityButton", () => {
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
    it("should render plus button with correct properties", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("data-size", "sm");
      expect(button).toHaveAttribute("data-variant", "light");
      expect(button).toHaveAttribute("data-icon-only", "true");
      expect(button).toHaveAttribute("data-radius", "full");
      expect(button).toHaveAttribute("aria-label", "Increase item quantity");
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("should render minus button with correct properties", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toHaveAttribute("aria-label", "Reduce item quantity");
      expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    });

    it("should show loading state when pending", () => {
      mockUseActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, true]);

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Form Submission", () => {
    it("should initialize with correct action and state", () => {
      const { updateItemQuantity } = require("@/app/actions/cart");

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(mockUseActionState).toHaveBeenCalledWith(updateItemQuantity, {
        success: null,
        message: "",
      });
    });

    it("should call optimistic update on form submit for plus", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "plus");
    });

    it("should call optimistic update on form submit for minus", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "minus");
    });
  });

  describe("Toast Notifications", () => {
    it("should show success toast", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      mockUseActionState.mockReturnValue([
        { success: true, message: "Item updated successfully" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(addToast).toHaveBeenCalledWith({
        title: "Item updated successfully",
        color: "success",
      });
    });

    it("should show error toast", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      mockUseActionState.mockReturnValue([
        { success: false, message: "Update failed" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(addToast).toHaveBeenCalledWith({
        title: "Failed to update item quantity",
        color: "danger",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle item without documentId", () => {
      const itemWithoutDocId = { ...mockCartItem, documentId: "" };

      render(
        <EditItemQuantityButton
          item={itemWithoutDocId}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toBeInTheDocument();
    });
  });
});
