import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddToCart } from "../AddToCart";
import type { Book } from "@/types";

jest.mock("@/hooks/useCart", () => ({
  useCart: jest.fn(() => ({
    addCartItem: jest.fn(),
  })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@/app/actions/cart", () => ({
  addItem: jest.fn(),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    variant,
    color,
    type,
    "aria-label": ariaLabel,
    disabled,
    isLoading,
  }: any) {
    return (
      <button
        type={type}
        aria-label={ariaLabel}
        data-variant={variant}
        data-color={color}
        data-testid="button"
        disabled={disabled || isLoading}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@heroui/react", () => ({
  addToast: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(() => [null, jest.fn()]),
  useEffect: jest.fn((callback) => callback()),
}));

describe("AddToCart", () => {
  const mockBook: Book = {
    id: "1",
    documentId: "doc-1",
    slug: "test-book",
    title: "Test Book",
    price: 19.99,
    language: "en",
    description: "A great test book",
    imageUrl: "/test-book.jpg",
    categories: [],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    publishedAt: "2023-01-01T00:00:00.000Z",
  };

  const mockAddCartItem = jest.fn();
  const mockRouterPush = jest.fn();
  const mockFormAction = jest.fn();

  beforeEach(() => {
    const { useCart } = require("@/hooks/useCart");
    const { useRouter } = require("next/navigation");
    const { useActionState } = require("react");

    useCart.mockReturnValue({
      addCartItem: mockAddCartItem,
    });

    useRouter.mockReturnValue({
      push: mockRouterPush,
    });

    useActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, false]);

    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render form with 'Add To Cart' button for add variant", () => {
      const { container } = render(<AddToCart book={mockBook} variant="add" />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();

      const button = screen.getByTestId("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Add To Cart");
      expect(button).toHaveAttribute("aria-label", "Add to cart");
      expect(button).toHaveAttribute("data-variant", "solid");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should render form with 'Order Today' button for order variant", () => {
      render(<AddToCart book={mockBook} variant="order" />);

      const button = screen.getByTestId("button");
      expect(button).toHaveTextContent("Order Today");
      expect(button).toHaveAttribute("aria-label", "Order Today");
      expect(button).toHaveAttribute("data-variant", "ghost");
      expect(button).toHaveAttribute("data-color", "primary");
    });
  });

  describe("Form Submission", () => {
    it("should call addCartItem when form is submitted", async () => {
      const { container } = render(<AddToCart book={mockBook} variant="add" />);

      const form = container.querySelector("form");
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 1);
      });
    });

    it("should handle both add and order variants submission", async () => {
      const { container: addContainer } = render(<AddToCart book={mockBook} variant="add" />);
      const addForm = addContainer.querySelector("form");

      fireEvent.submit(addForm!);
      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 1);
      });

      jest.clearAllMocks();

      const { container: orderContainer } = render(<AddToCart book={mockBook} variant="order" />);
      const orderForm = orderContainer.querySelector("form");

      fireEvent.submit(orderForm!);
      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 1);
      });
    });
  });

  describe("Authentication Handling", () => {
    it("should redirect to login when unauthorized", () => {
      const { useActionState } = require("react");
      const { useEffect } = require("react");

      useActionState.mockReturnValue([
        { success: false, message: "UNAUTHORIZED" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(<AddToCart book={mockBook} variant="add" />);

      expect(mockRouterPush).toHaveBeenCalledWith("/login");
    });

    it("should not redirect when message is not UNAUTHORIZED", () => {
      const { useActionState } = require("react");

      useActionState.mockReturnValue([
        { success: true, message: "SUCCESS" },
        mockFormAction,
        false,
      ]);

      render(<AddToCart book={mockBook} variant="add" />);

      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show loading state on button when pending", () => {
      const { useActionState } = require("react");

      useActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, true]);

      render(<AddToCart book={mockBook} variant="order" />);

      const button = screen.getByTestId("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Toast Notifications", () => {
    it("should handle success result", () => {
      const { useActionState } = require("react");
      const { useEffect } = require("react");

      useActionState.mockReturnValue([
        { success: true, message: "Item added successfully" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(<AddToCart book={mockBook} variant="add" />);

      expect(screen.getByTestId("button")).toBeInTheDocument();
    });

    it("should handle failure result that is not unauthorized", () => {
      const { useActionState } = require("react");
      const { useEffect } = require("react");

      useActionState.mockReturnValue([
        { success: false, message: "Some other error" },
        mockFormAction,
        false,
      ]);

      useEffect.mockImplementation((callback: any) => {
        callback();
      });

      render(<AddToCart book={mockBook} variant="add" />);

      expect(screen.getByTestId("button")).toBeInTheDocument();
    });
  });
});
