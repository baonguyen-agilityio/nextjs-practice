import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartModal from "../CartModal";
import type { CartItem, Cart } from "@/types";

const mockUpdateCartItem = jest.fn();
const mockUseCart = jest.fn();

jest.mock("@/services/cart", () => ({
  createCart: jest.fn(),
}));

jest.mock("@/hooks/useCart", () => ({
  useCart: () => mockUseCart(),
}));

jest.mock("@/utils/currency", () => ({
  formatUSD: jest.fn((price) => `$${price}`),
}));

jest.mock("@/utils", () => ({
  createImageUrl: jest.fn((url) => `http://localhost:1337${url}`),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({
    children,
    onPress,
    variant,
    fullWidth,
    disableAnimation,
    ...props
  }: any) {
    const { disableAnimation: _, ...cleanProps } = props;
    return (
      <button
        onClick={onPress}
        data-testid="button"
        data-variant={variant}
        data-full-width={fullWidth}
        {...cleanProps}
      >
        {children}
      </button>
    );
  },
}));

jest.mock("@heroui/react", () => ({
  Image: function MockImage({ src, alt, width }: any) {
    return <img src={src} alt={alt} width={width} data-testid="cart-image" />;
  },
  Modal: function MockModal({
    children,
    isOpen,
    onOpenChange,
    classNames,
    backdrop,
    radius,
    ...props
  }: any) {
    return isOpen ? (
      <div data-testid="modal" {...props}>
        {typeof children === "function" ? children() : children}
      </div>
    ) : null;
  },
  ModalContent: function MockModalContent({ children }: any) {
    return (
      <div data-testid="modal-content">
        {typeof children === "function" ? children() : children}
      </div>
    );
  },
  ModalHeader: function MockModalHeader({ children }: any) {
    return <div data-testid="modal-header">{children}</div>;
  },
  ModalBody: function MockModalBody({ children }: any) {
    return <div data-testid="modal-body">{children}</div>;
  },
  ModalFooter: function MockModalFooter({ children }: any) {
    return <div data-testid="modal-footer">{children}</div>;
  },
}));

jest.mock("../OpenCart", () => ({
  OpenCart: function MockOpenCart({ quantity }: any) {
    return (
      <div data-testid="open-cart" data-quantity={quantity}>
        Cart ({quantity})
      </div>
    );
  },
}));

jest.mock("../DeleteItemButton", () => ({
  DeleteItemButton: function MockDeleteItemButton({ item }: any) {
    return (
      <div data-testid="delete-item-button" data-item-id={item.book?.id}>
        Delete
      </div>
    );
  },
}));

jest.mock("../EditItemQuantityButton", () => ({
  EditItemQuantityButton: function MockEditItemQuantityButton({ item, type }: any) {
    return (
      <div data-testid={`edit-quantity-${type}`} data-item-id={item.book?.id}>
        {type}
      </div>
    );
  },
}));

jest.mock("@/components/icons/ShoppingCartIcon", () => {
  return function MockShoppingCartIcon({ className }: any) {
    return (
      <div data-testid="shopping-cart-icon" className={className}>
        Cart Icon
      </div>
    );
  };
});

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
    cost: {
      totalAmount: 59.98,
    },
  };

  beforeEach(() => {
    mockUseCart.mockReturnValue({
      cart: mockCart,
      updateCartItem: mockUpdateCartItem,
    });
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render cart trigger button with quantity", () => {
      render(<CartModal />);

      const openCartTrigger = screen.getByTestId("open-cart");
      expect(openCartTrigger).toBeInTheDocument();
      expect(openCartTrigger).toHaveAttribute("data-quantity", "2");
    });

    it("should render empty cart state", async () => {
      mockUseCart.mockReturnValue({
        cart: { ...mockCart, cartItems: [] },
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal />);
      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
        expect(screen.getByTestId("shopping-cart-icon")).toBeInTheDocument();
      });
    });

    it("should render cart items with all components", async () => {
      const { formatUSD } = require("@/utils/currency");
      formatUSD.mockReturnValueOnce("$29.99").mockReturnValueOnce("$59.98");

      render(<CartModal />);
      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(screen.getByText("Test Book")).toBeInTheDocument();
        expect(screen.getByTestId("cart-image")).toHaveAttribute(
          "src",
          "http://localhost:1337/test-image.jpg"
        );
        expect(screen.getAllByText("$29.99")).toHaveLength(1);
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByTestId("delete-item-button")).toBeInTheDocument();
        expect(screen.getByTestId("edit-quantity-minus")).toBeInTheDocument();
        expect(screen.getByTestId("edit-quantity-plus")).toBeInTheDocument();
      });
    });
  });

  describe("Modal Behavior", () => {
    it("should open and close modal", async () => {
      render(<CartModal />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId("button"));
      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
        expect(screen.getByTestId("modal-header")).toHaveTextContent("Your Cart");
      });

      const closeButton = screen.getByText("Close");
      fireEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      });
    });

    it("should display subtotal correctly", async () => {
      const { formatUSD } = require("@/utils/currency");
      formatUSD.mockReturnValueOnce("$29.99").mockReturnValueOnce("$59.98");

      render(<CartModal />);
      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(screen.getByText("Sub-Total")).toBeInTheDocument();
        const modalFooter = screen.getByTestId("modal-footer");
        expect(modalFooter).toHaveTextContent("$59.98");
      });
    });
  });

  describe("Cart Creation", () => {
    it("should call createCart when cart is null", () => {
      const { createCart } = require("@/services/cart");

      mockUseCart.mockReturnValue({
        cart: null,
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal />);

      expect(createCart).toHaveBeenCalled();
    });

    it("should call custom onCreateCart when provided", () => {
      const mockOnCreateCart = jest.fn();
      const { createCart } = require("@/services/cart");

      mockUseCart.mockReturnValue({
        cart: null,
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal onCreateCart={mockOnCreateCart} />);

      expect(mockOnCreateCart).toHaveBeenCalled();
      expect(createCart).not.toHaveBeenCalled();
    });

    it("should call createCart for empty cart", () => {
      const { createCart } = require("@/services/cart");

      mockUseCart.mockReturnValue({
        cart: { ...mockCart, cartItems: [] },
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal />);

      expect(createCart).toHaveBeenCalled();
    });
  });
});
