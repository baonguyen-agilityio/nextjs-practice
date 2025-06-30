import { render, screen, fireEvent } from "@testing-library/react";
import CartModal from "../CartModal";
import type { CartItem, Cart } from "@/types";

// Mock dependencies
jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, ...props }: any) {
    const { variant, fullWidth, disableAnimation, ...domProps } = props;
    return (
      <button onClick={onPress} data-testid="cart-button" {...domProps}>
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/ui/Modal", () => ({
  Modal: function MockModal({ children, isOpen, title, footer, ...props }: any) {
    return isOpen ? (
      <div data-testid="modal" data-title={title}>
        {children}
        {footer && <div data-testid="modal-footer">{footer}</div>}
      </div>
    ) : null;
  },
  useModal: jest.fn(),
}));

jest.mock("../OpenCart", () => ({
  OpenCart: function MockOpenCart({ quantity }: any) {
    return (
      <div data-testid="open-cart" data-quantity={quantity}>
        Cart
      </div>
    );
  },
}));

jest.mock("@/components/icons/ShoppingCartIcon", () => {
  return function MockShoppingCartIcon() {
    return <div data-testid="shopping-cart-icon">Cart Icon</div>;
  };
});

jest.mock("@/components/ui/ImageWithFallback", () => {
  return function MockImageWithFallback({ alt }: any) {
    return <img alt={alt} data-testid="book-image" />;
  };
});

jest.mock("../DeleteItemButton", () => ({
  DeleteItemButton: function MockDeleteItemButton() {
    return <div data-testid="delete-button">Delete</div>;
  },
}));

jest.mock("../EditItemQuantityButton", () => ({
  EditItemQuantityButton: function MockEditItemQuantityButton({ type }: any) {
    return <div data-testid={`edit-quantity-${type}`}>{type}</div>;
  },
}));

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price) => `$${price.toFixed(2)}`),
}));

jest.mock("@/utils", () => ({
  createImageUrl: jest.fn((url) => url),
}));

jest.mock("@/services/cart", () => ({
  createCart: jest.fn(),
}));

jest.mock("@/hooks/useCart", () => ({
  useCart: jest.fn(),
}));

describe("CartModal", () => {
  const mockCartItem: CartItem = {
    id: "1",
    documentId: "cart-item-1",
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

  const mockCart: Cart = {
    id: "cart-1",
    totalQuantity: 2,
    cartItems: [mockCartItem],
    cost: { totalAmount: 59.98 },
  };

  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnOpenChange = jest.fn();
  const mockUpdateCartItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    const { useModal } = require("@/components/ui/Modal");
    const { useCart } = require("@/hooks/useCart");

    useModal.mockReturnValue({
      isOpen: false,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    useCart.mockReturnValue({
      cart: mockCart,
      updateCartItem: mockUpdateCartItem,
    });
  });

  it("renders cart button and opens modal when clicked", () => {
    render(<CartModal />);

    const openCart = screen.getByTestId("open-cart");
    expect(openCart).toHaveAttribute("data-quantity", "2");

    const button = screen.getByTestId("cart-button");
    fireEvent.click(button);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it("shows modal when open with cart items", () => {
    const { useModal } = require("@/components/ui/Modal");
    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    render(<CartModal />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toHaveAttribute("data-title", "Your Cart");
    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByTestId("book-image")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    expect(screen.getByTestId("edit-quantity-minus")).toBeInTheDocument();
    expect(screen.getByTestId("edit-quantity-plus")).toBeInTheDocument();
    expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
    expect(screen.getByText("$59.98 USD")).toBeInTheDocument();
  });

  it("shows empty cart state when no items", () => {
    const { useModal } = require("@/components/ui/Modal");
    const { useCart } = require("@/hooks/useCart");

    useModal.mockReturnValue({
      isOpen: true,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
      onOpenChange: mockOnOpenChange,
    });

    useCart.mockReturnValue({
      cart: { ...mockCart, cartItems: [] },
      updateCartItem: mockUpdateCartItem,
    });

    render(<CartModal />);

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByTestId("shopping-cart-icon")).toBeInTheDocument();
  });

  it("does not show modal when closed", () => {
    render(<CartModal />);
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("calls createCart when cart is null", () => {
    const { createCart } = require("@/services/cart");
    const { useCart } = require("@/hooks/useCart");

    useCart.mockReturnValue({
      cart: null,
      updateCartItem: mockUpdateCartItem,
    });

    render(<CartModal />);
    expect(createCart).toHaveBeenCalledTimes(1);
  });

  it("calls createCart when cart has no items", () => {
    const { createCart } = require("@/services/cart");
    const { useCart } = require("@/hooks/useCart");

    useCart.mockReturnValue({
      cart: { ...mockCart, cartItems: [] },
      updateCartItem: mockUpdateCartItem,
    });

    render(<CartModal />);
    expect(createCart).toHaveBeenCalledTimes(1);
  });
});
