import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DeleteItemButton } from "../DeleteItemButton";
import type { CartItem } from "@/types";

export type OptimisticUpdateFn = (bookId: string, action: "delete") => void;

const mockFormAction = jest.fn();
const mockUseActionState = jest.fn();

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
    onClick,
    type,
    variant,
    disabled,
    isLoading,
    ...props
  }: any) {
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled || isLoading}
        data-testid="delete-button"
        data-variant={variant}
        data-loading={isLoading}
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
    mockUseActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, false]);
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render delete button with correct text", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Remove");
    });

    it("should render button with correct properties", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("data-variant", "light");
    });

    it("should render form wrapper", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should use default removeItem action with correct initial state", () => {
      const { removeItem } = require("@/app/actions");

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(mockUseActionState).toHaveBeenCalledWith(removeItem, {
        success: null,
        message: "",
      });
    });

    it("should handle loading state correctly", () => {
      mockUseActionState.mockReturnValue([
        { success: null, message: "" },
        mockFormAction,
        true, // isPending = true
      ]);

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toHaveAttribute("disabled");
      expect(button).toHaveAttribute("data-loading", "true");
    });
  });

  describe("Integration", () => {
    it("should call optimistic update when form is submitted", () => {
      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      const form = document.querySelector("form");
      fireEvent.submit(form!);

      expect(mockOptimisticUpdate).toHaveBeenCalledWith("book-1", "delete");
    });

    it("should handle cart item without book gracefully", () => {
      const itemWithoutBook = { ...mockCartItem, book: null };

      render(
        <DeleteItemButton item={itemWithoutBook as any} optimisticUpdate={mockOptimisticUpdate} />
      );

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
    });

    it("should handle cart item without documentId gracefully", () => {
      const itemWithoutDocId = { ...mockCartItem, documentId: "" };

      render(<DeleteItemButton item={itemWithoutDocId} optimisticUpdate={mockOptimisticUpdate} />);

      const button = screen.getByTestId("delete-button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("useActionState Integration", () => {
    it("should call useActionState with correct parameters", () => {
      const { removeItem } = require("@/app/actions");

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(mockUseActionState).toHaveBeenCalledWith(removeItem, {
        success: null,
        message: "",
      });
    });

    it("should handle success state correctly", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      mockUseActionState.mockReturnValue([
        { success: true, message: "Item removed successfully" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any, deps: any) => {
        // Simulate the effect running when result changes
        if (deps && deps.some((dep: any) => dep?.success === true)) {
          callback();
        }
      });

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(addToast).toHaveBeenCalledWith({
        title: "Item removed successfully",
        color: "success",
        shouldShowTimeoutProgress: true,
      });
    });

    it("should handle error state correctly", () => {
      const { useEffect } = require("react");
      const { addToast } = require("@heroui/react");

      mockUseActionState.mockReturnValue([
        { success: false, message: "Failed to remove item" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any, deps: any) => {
        // Simulate the effect running when result changes
        if (deps && deps.some((dep: any) => dep?.success === false)) {
          callback();
        }
      });

      render(<DeleteItemButton item={mockCartItem} optimisticUpdate={mockOptimisticUpdate} />);

      expect(addToast).toHaveBeenCalledWith({
        title: "Failed to remove item",
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    });
  });
});
