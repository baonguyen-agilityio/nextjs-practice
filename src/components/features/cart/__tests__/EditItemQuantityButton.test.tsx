import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  EditItemQuantityButton,
  calculateNewQuantity,
  getAriaLabel,
  getCartItemId,
  getBookId,
  createDebouncedUpdate,
  getButtonProps,
  renderIcon,
  DEBOUNCE_DELAY,
  INCREASE_ARIA_LABEL,
  DECREASE_ARIA_LABEL,
  type OptimisticUpdateFn,
  type QuantityUpdateType,
} from "../EditItemQuantityButton";
import type { CartItem } from "@/types";

const mockOptimisticUpdate: OptimisticUpdateFn = jest.fn();

jest.mock("@/app/actions/cart", () => ({
  updateItemQuantity: jest.fn(),
}));

jest.mock("lodash/debounce", () => jest.fn((fn) => fn));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn().mockImplementation((value) => ({ current: value })),
  useCallback: jest.fn().mockImplementation((fn: any) => fn),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    onClick,
    size,
    variant,
    isIconOnly,
    radius,
    ...props
  }: any) {
    return (
      <button
        onClick={onClick}
        data-testid="quantity-button"
        data-size={size}
        data-variant={variant}
        data-icon-only={isIconOnly}
        data-radius={radius}
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

  describe("Helper Functions", () => {
    describe("calculateNewQuantity", () => {
      it("should increase quantity for plus type", () => {
        expect(calculateNewQuantity(5, "plus")).toBe(6);
      });

      it("should decrease quantity for minus type", () => {
        expect(calculateNewQuantity(5, "minus")).toBe(4);
      });

      it("should handle zero quantity", () => {
        expect(calculateNewQuantity(0, "plus")).toBe(1);
        expect(calculateNewQuantity(1, "minus")).toBe(0);
      });

      it("should handle negative results", () => {
        expect(calculateNewQuantity(0, "minus")).toBe(-1);
      });
    });

    describe("getAriaLabel", () => {
      it("should return correct label for plus type", () => {
        expect(getAriaLabel("plus")).toBe(INCREASE_ARIA_LABEL);
      });

      it("should return correct label for minus type", () => {
        expect(getAriaLabel("minus")).toBe(DECREASE_ARIA_LABEL);
      });
    });

    describe("getCartItemId", () => {
      it("should return document ID when it exists", () => {
        expect(getCartItemId(mockCartItem)).toBe("doc-cart-item-1");
      });

      it("should return empty string when document ID is missing", () => {
        const itemWithoutDocId = { ...mockCartItem, documentId: undefined };
        expect(getCartItemId(itemWithoutDocId)).toBe("");
      });
    });

    describe("getBookId", () => {
      it("should return book ID when book exists", () => {
        expect(getBookId(mockCartItem)).toBe("book-1");
      });

      it("should return empty string when book is missing", () => {
        const itemWithoutBook = { ...mockCartItem, book: undefined };
        expect(getBookId(itemWithoutBook as any)).toBe("");
      });
    });

    describe("createDebouncedUpdate", () => {
      it("should create debounced function with default delay", () => {
        const mockFn = jest.fn();
        const debounce = require("lodash/debounce");

        createDebouncedUpdate(mockFn);

        expect(debounce).toHaveBeenCalledWith(mockFn, DEBOUNCE_DELAY);
      });

      it("should create debounced function with custom delay", () => {
        const mockFn = jest.fn();
        const debounce = require("lodash/debounce");

        createDebouncedUpdate(mockFn, 1000);

        expect(debounce).toHaveBeenCalledWith(mockFn, 1000);
      });
    });

    describe("getButtonProps", () => {
      it("should return correct props for plus button", () => {
        const props = getButtonProps("plus");

        expect(props).toEqual({
          size: "sm",
          variant: "light",
          disableAnimation: true,
          isIconOnly: true,
          radius: "full",
          "aria-label": INCREASE_ARIA_LABEL,
        });
      });

      it("should return correct props for minus button", () => {
        const props = getButtonProps("minus");

        expect(props).toEqual({
          size: "sm",
          variant: "light",
          disableAnimation: true,
          isIconOnly: true,
          radius: "full",
          "aria-label": DECREASE_ARIA_LABEL,
        });
      });
    });

    describe("renderIcon", () => {
      it("should render plus icon for plus type", () => {
        const { container } = render(<div>{renderIcon("plus")}</div>);
        expect(container.querySelector('[data-testid="plus-icon"]')).toBeInTheDocument();
      });

      it("should render minus icon for minus type", () => {
        const { container } = render(<div>{renderIcon("minus")}</div>);
        expect(container.querySelector('[data-testid="minus-icon"]')).toBeInTheDocument();
      });

      it("should render icons with correct class", () => {
        const { container } = render(<div>{renderIcon("plus")}</div>);
        const icon = container.querySelector('[data-testid="plus-icon"]');
        expect(icon).toHaveClass("h-4", "w-4");
      });
    });
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
      expect(button).toHaveAttribute("aria-label", INCREASE_ARIA_LABEL);
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
      expect(button).toHaveAttribute("aria-label", DECREASE_ARIA_LABEL);
    });
  });

  describe("Button Interactions", () => {
    it("should call optimistic update when plus button is clicked", () => {
      const { useCallback } = require("react");
      const mockHandleClick = jest.fn();

      useCallback.mockImplementation((fn: any) => {
        mockHandleClick.mockImplementation(fn);
        return mockHandleClick;
      });

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      mockHandleClick();

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "plus");
    });

    it("should call optimistic update when minus button is clicked", () => {
      const { useCallback } = require("react");
      const mockHandleClick = jest.fn();

      useCallback.mockImplementation((fn: any) => {
        mockHandleClick.mockImplementation(fn);
        return mockHandleClick;
      });

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      mockHandleClick();

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "minus");
    });

    it("should call debounced server update with correct parameters for plus", () => {
      const mockDebouncedUpdate = jest.fn();
      const { useRef } = require("react");

      useRef.mockReturnValue({ current: mockDebouncedUpdate });

      const { useCallback } = require("react");
      const mockHandleClick = jest.fn();

      useCallback.mockImplementation((fn: any) => {
        mockHandleClick.mockImplementation(fn);
        return mockHandleClick;
      });

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      mockHandleClick();

      expect(mockDebouncedUpdate).toHaveBeenCalledWith({
        cartItemId: "doc-cart-item-1",
        quantity: 3, // 2 + 1
      });
    });

    it("should call debounced server update with correct parameters for minus", () => {
      const mockDebouncedUpdate = jest.fn();
      const { useRef } = require("react");

      useRef.mockReturnValue({ current: mockDebouncedUpdate });

      const { useCallback } = require("react");
      const mockHandleClick = jest.fn();

      useCallback.mockImplementation((fn: any) => {
        mockHandleClick.mockImplementation(fn);
        return mockHandleClick;
      });

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      mockHandleClick();

      expect(mockDebouncedUpdate).toHaveBeenCalledWith({
        cartItemId: "doc-cart-item-1",
        quantity: 1, // 2 - 1
      });
    });
  });

  describe("Custom Update Function", () => {
    it("should use custom update function when provided", () => {
      const customUpdateFn = jest.fn();
      const debounce = require("lodash/debounce");

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
          onUpdateQuantity={customUpdateFn}
        />
      );

      expect(debounce).toHaveBeenCalledWith(customUpdateFn, DEBOUNCE_DELAY);
    });

    it("should use default update function when none provided", () => {
      const { updateItemQuantity } = require("@/app/actions/cart");
      const debounce = require("lodash/debounce");

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      expect(debounce).toHaveBeenCalledWith(updateItemQuantity, DEBOUNCE_DELAY);
    });

    it("should use custom debounce delay", () => {
      const customUpdateFn = jest.fn();
      const debounce = require("lodash/debounce");

      render(
        <EditItemQuantityButton
          item={mockCartItem}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
          onUpdateQuantity={customUpdateFn}
          debounceDelay={1000}
        />
      );

      expect(debounce).toHaveBeenCalledWith(customUpdateFn, 1000);
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart item without book", () => {
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

    it("should handle zero quantity", () => {
      const itemWithZeroQuantity = { ...mockCartItem, quantity: 0 };

      const { useCallback } = require("react");
      const mockHandleClick = jest.fn();

      useCallback.mockImplementation((fn: any) => {
        mockHandleClick.mockImplementation(fn);
        return mockHandleClick;
      });

      render(
        <EditItemQuantityButton
          item={itemWithZeroQuantity}
          type="plus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      mockHandleClick();
      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "plus");
    });

    it("should handle negative quantity results", () => {
      const itemWithOneQuantity = { ...mockCartItem, quantity: 1 };
      const mockDebouncedUpdate = jest.fn();
      const { useRef } = require("react");

      useRef.mockReturnValue({ current: mockDebouncedUpdate });

      const { useCallback } = require("react");
      const mockHandleClick = jest.fn();

      useCallback.mockImplementation((fn: any) => {
        mockHandleClick.mockImplementation(fn);
        return mockHandleClick;
      });

      render(
        <EditItemQuantityButton
          item={itemWithOneQuantity}
          type="minus"
          optimisticUpdate={mockOptimisticUpdate}
        />
      );

      mockHandleClick();

      expect(mockDebouncedUpdate).toHaveBeenCalledWith({
        cartItemId: "doc-cart-item-1",
        quantity: 0, // 1 - 1 = 0
      });
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

      const button = screen.getByLabelText(INCREASE_ARIA_LABEL);
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

      const button = screen.getByLabelText(DECREASE_ARIA_LABEL);
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
