import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditItemQuantityButton } from "../EditItemQuantityButton";
import type { CartItem } from "@/types";

const mockOptimisticUpdate: any = jest.fn();

jest.mock("@/app/actions/cart", () => ({
  updateItemQuantity: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn().mockReturnValue([{ success: null, message: "" }, jest.fn(), false]),
  useEffect: jest.fn(),
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    onClick,
    size,
    variant,
    isIconOnly,
    radius,
    type,
    isLoading,
    disableAnimation,
    ...props
  }: any) {
    return (
      <button
        onClick={onClick}
        type={type}
        data-testid="quantity-button"
        data-size={size}
        data-variant={variant}
        data-icon-only={isIconOnly}
        data-radius={radius}
        data-loading={isLoading}
        data-disable-animation={disableAnimation}
        {...props}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@heroicons/react/24/outline", () => ({
  MinusIcon: function MockMinusIcon({ className }: any) {
    return (
      <div data-testid="minus-icon" className={className}>
        -
      </div>
    );
  },
  PlusIcon: function MockPlusIcon({ className }: any) {
    return (
      <div data-testid="plus-icon" className={className}>
        +
      </div>
    );
  },
}));

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
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render plus button with correct icon", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(screen.getByTestId("quantity-button")).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("should render minus button with correct icon", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(screen.getByTestId("quantity-button")).toBeInTheDocument();
      expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    });

    it("should render button with correct properties", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toHaveAttribute("data-size", "sm");
      expect(button).toHaveAttribute("data-variant", "light");
      expect(button).toHaveAttribute("data-icon-only", "true");
      expect(button).toHaveAttribute("data-radius", "full");
      expect(button).toHaveAttribute("aria-label", "Increase item quantity");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should render minus button with correct aria label", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toHaveAttribute("aria-label", "Reduce item quantity");
    });

    it("should render form wrapper", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("useActionState Integration", () => {
    it("should call useActionState with updateItemQuantity", () => {
      const { useActionState } = require("react");
      const { updateItemQuantity } = require("@/app/actions/cart");

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(useActionState).toHaveBeenCalledWith(updateItemQuantity, {
        success: null,
        message: "",
      });
    });

    it("should show loading state when isPending is true", () => {
      const { useActionState } = require("react");
      useActionState.mockReturnValue([{ success: null, message: "" }, jest.fn(), true]);

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

  describe("Form Action", () => {
    it("should call optimisticUpdate when form is submitted for plus button", async () => {
      const mockFormAction = jest.fn();
      const { useActionState } = require("react");
      useActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, false]);

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

    it("should call optimisticUpdate when form is submitted for minus button", async () => {
      const mockFormAction = jest.fn();
      const { useActionState } = require("react");
      useActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, false]);

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
    it("should show success toast when result is successful", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      // Mock useEffect to simulate the effect running
      useEffect.mockImplementation((callback: () => void) => callback());

      const { useActionState } = require("react");
      useActionState.mockReturnValue([
        { success: true, message: "Item updated successfully" },
        jest.fn(),
        false,
      ]);

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
        shouldShowTimeoutProgress: true,
      });
    });

    it("should show error toast when result is unsuccessful", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      // Mock useEffect to simulate the effect running
      useEffect.mockImplementation((callback: () => void) => callback());

      const { useActionState } = require("react");
      useActionState.mockReturnValue([
        { success: false, message: "Update failed" },
        jest.fn(),
        false,
      ]);

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
        shouldShowTimeoutProgress: true,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart item without book gracefully", () => {
      const itemWithoutBook = { ...mockCartItem, book: undefined };

      render(
        <EditItemQuantityButton
          item={itemWithoutBook as any}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toBeInTheDocument();
    });

    it("should handle missing document ID", () => {
      const itemWithoutDocId = { ...mockCartItem, documentId: undefined };

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

    it("should handle zero quantity for plus operation", () => {
      const itemWithZeroQuantity = { ...mockCartItem, quantity: 0 };

      render(
        <EditItemQuantityButton
          item={itemWithZeroQuantity}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toBeInTheDocument();
    });

    it("should handle quantity calculation for minus operation", () => {
      const itemWithOneQuantity = { ...mockCartItem, quantity: 1 };

      render(
        <EditItemQuantityButton
          item={itemWithOneQuantity}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByTestId("quantity-button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria labels for screen readers", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByLabelText("Increase item quantity");
      expect(button).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByLabelText("Reduce item quantity");
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveAttribute("disabled");
    });

    it("should have proper button role", () => {
      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });
});
