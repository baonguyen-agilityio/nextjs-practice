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
  Button: function MockButton({ children, variant, color, type, "aria-label": ariaLabel }: any) {
    return (
      <button
        type={type}
        aria-label={ariaLabel}
        data-variant={variant}
        data-color={color}
        data-testid="button"
      >
        {children}
      </button>
    );
  },
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

  it("should render add to cart form", () => {
    const { container } = render(<AddToCart book={mockBook} variant="add" />);

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
  });

  it("should render 'Add To Cart' button for add variant", () => {
    render(<AddToCart book={mockBook} variant="add" />);

    const button = screen.getByTestId("button");
    expect(button).toHaveTextContent("Add To Cart");
    expect(button).toHaveAttribute("aria-label", "Add to cart");
    expect(button).toHaveAttribute("data-variant", "solid");
  });

  it("should render 'Order Today' button for order variant", () => {
    render(<AddToCart book={mockBook} variant="order" />);

    const button = screen.getByTestId("button");
    expect(button).toHaveTextContent("Order Today");
    expect(button).toHaveAttribute("aria-label", "Order Today");
    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button).toHaveAttribute("data-color", "primary");
  });

  it("should have submit type button", () => {
    render(<AddToCart book={mockBook} variant="add" />);

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should call addCartItem when form is submitted", async () => {
    const { container } = render(<AddToCart book={mockBook} variant="add" />);

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 1);
    });
  });

  it("should handle form submission for order variant", async () => {
    const { container } = render(<AddToCart book={mockBook} variant="order" />);

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockAddCartItem).toHaveBeenCalledWith(mockBook, 1);
    });
  });

  it("should redirect to login when unauthorized", () => {
    const { useActionState } = require("react");
    const { useEffect } = require("react");

    // Return correct structure: [result, formAction, isPending]
    useActionState.mockReturnValue([
      { success: false, message: "UNAUTHORIZED" },
      mockFormAction,
      false,
    ]);

    // Mock useEffect to immediately call the callback
    useEffect.mockImplementation((callback: any) => {
      callback();
    });

    render(<AddToCart book={mockBook} variant="add" />);

    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("should not redirect when message is not UNAUTHORIZED", () => {
    const { useActionState } = require("react");

    useActionState.mockReturnValue([{ success: true, message: "SUCCESS" }, mockFormAction, false]);

    render(<AddToCart book={mockBook} variant="add" />);

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("should bind correct parameters to form action", () => {
    const { container } = render(<AddToCart book={mockBook} variant="add" />);

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    expect(mockFormAction).toBeDefined();
  });

  it("should handle different book IDs", () => {
    const differentBook: Book = {
      ...mockBook,
      id: "different-id",
    };

    const { container } = render(<AddToCart book={differentBook} variant="add" />);

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    expect(mockAddCartItem).toHaveBeenCalledWith(differentBook, 1);
  });

  it("should have accessible form structure", () => {
    const { container } = render(<AddToCart book={mockBook} variant="add" />);

    const form = container.querySelector("form");
    const button = screen.getByRole("button");

    expect(form).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label");
  });

  it("should handle null message state", () => {
    const { useActionState } = require("react");

    useActionState.mockReturnValue([{ success: null, message: "" }, mockFormAction, false]);

    render(<AddToCart book={mockBook} variant="add" />);

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("should handle empty message state", () => {
    const { useActionState } = require("react");

    useActionState.mockReturnValue([{ success: false, message: "" }, mockFormAction, false]);

    render(<AddToCart book={mockBook} variant="add" />);

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it("should render correct button variant classes", () => {
    const { container: addContainer } = render(<AddToCart book={mockBook} variant="add" />);
    const addButton = addContainer.querySelector('[data-testid="button"]');
    expect(addButton).toHaveAttribute("data-variant", "solid");

    const { container: orderContainer } = render(<AddToCart book={mockBook} variant="order" />);
    const orderButton = orderContainer.querySelector('[data-testid="button"]');
    expect(orderButton).toHaveAttribute("data-variant", "ghost");
    expect(orderButton).toHaveAttribute("data-color", "primary");
  });

  it("should maintain consistent quantity of 1", async () => {
    const { container } = render(<AddToCart book={mockBook} variant="add" />);

    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockAddCartItem).toHaveBeenCalledWith(expect.any(Object), 1);
    });
  });
});
