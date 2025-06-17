import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartModal, {
  createImageUrl,
  isCartEmpty,
  formatPrice,
  getTotalAmount,
  getModalClassNames,
  getEmptyCartStyles,
  getQuantityControlsStyles,
  MODAL_TITLE,
  EMPTY_CART_MESSAGE,
  SUBTOTAL_LABEL,
  CLOSE_BUTTON_TEXT,
} from "../CartModal";
import type { Cart, CartItem } from "@/types";

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

jest.mock("@/components/ui/Button", () => ({
  Button: function MockButton({ children, onPress, variant, fullWidth, ...props }: any) {
    return (
      <button
        onClick={onPress}
        data-testid="button"
        data-variant={variant}
        data-full-width={fullWidth}
        {...props}
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
  Modal: function MockModal({ children, isOpen, classNames, onOpenChange, ...props }: any) {
    return isOpen ? (
      <div data-testid="modal" data-class-names={JSON.stringify(classNames)} {...props}>
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
  ModalHeader: function MockModalHeader({ children, className }: any) {
    return (
      <div data-testid="modal-header" className={className}>
        {children}
      </div>
    );
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

jest.mock("@heroicons/react/24/outline", () => ({
  ShoppingCartIcon: function MockShoppingCartIcon({ className }: any) {
    return (
      <div data-testid="shopping-cart-icon" className={className}>
        🛒
      </div>
    );
  },
}));

const originalEnv = process.env;

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
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_STRAPI_URL = "http://localhost:1337";

    mockUseCart.mockReturnValue({
      cart: mockCart,
      updateCartItem: mockUpdateCartItem,
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Helper Functions", () => {
    describe("createImageUrl", () => {
      it("should create image URL with base URL", () => {
        const result = createImageUrl("http://localhost:1337", "/test.jpg");
        expect(result).toBe("http://localhost:1337/test.jpg");
      });

      it("should handle undefined base URL", () => {
        const result = createImageUrl(undefined, "/test.jpg");
        expect(result).toBe("/test.jpg");
      });
    });

    describe("isCartEmpty", () => {
      it("should return true for null cart", () => {
        expect(isCartEmpty(null)).toBe(true);
      });

      it("should return true for undefined cart", () => {
        expect(isCartEmpty(undefined)).toBe(true);
      });

      it("should return true for cart with no items", () => {
        expect(isCartEmpty({ ...mockCart, cartItems: [] })).toBe(true);
      });

      it("should return false for cart with items", () => {
        expect(isCartEmpty(mockCart)).toBe(false);
      });
    });

    describe("formatPrice", () => {
      it("should format price correctly", () => {
        const { formatUSD } = require("@/utils/currency");
        formatUSD.mockReturnValue("$29.99");

        const result = formatPrice(29.99);
        expect(formatUSD).toHaveBeenCalledWith(29.99);
        expect(result).toBe("$29.99");
      });

      it("should handle zero price", () => {
        const { formatUSD } = require("@/utils/currency");
        formatUSD.mockReturnValue("$0.00");

        const result = formatPrice(0);
        expect(result).toBe("$0.00");
      });
    });

    describe("getTotalAmount", () => {
      it("should return total amount from cart", () => {
        expect(getTotalAmount(mockCart)).toBe(59.98);
      });

      it("should return 0 for empty cart", () => {
        expect(getTotalAmount(null)).toBe(0);
      });

      it("should return 0 for cart without cost", () => {
        const cartWithoutCost = { ...mockCart, cost: undefined };
        expect(getTotalAmount(cartWithoutCost)).toBe(0);
      });
    });

    describe("getModalClassNames", () => {
      it("should return correct class names object", () => {
        const classNames = getModalClassNames();
        expect(classNames).toEqual({
          body: "py-6",
          backdrop: "bg-primary/90 backdrop-opacity-40",
          base: "text-primary",
          header: "bg-secondary text-primary",
          footer: "flex flex-col gap-4",
          closeButton: "text-primary hover:bg-white/5 active:bg-white/10 top-3 right-2",
        });
      });
    });

    describe("getEmptyCartStyles", () => {
      it("should return correct empty cart styles", () => {
        const styles = getEmptyCartStyles();
        expect(styles).toBe(
          "mt-20 flex w-full flex-col items-center justify-center overflow-hidden"
        );
      });
    });

    describe("getQuantityControlsStyles", () => {
      it("should return correct quantity controls styles", () => {
        const styles = getQuantityControlsStyles();
        expect(styles).toBe(
          "ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700"
        );
      });
    });
  });

  describe("Component Rendering", () => {
    it("should render cart modal trigger button", () => {
      render(<CartModal />);

      const openCartTrigger = screen.getByTestId("open-cart");
      expect(openCartTrigger).toBeInTheDocument();
      expect(openCartTrigger).toHaveAttribute("data-quantity", "2");
    });

    it("should open modal when trigger is clicked", async () => {
      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });
    });

    it("should render modal with correct title", async () => {
      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal-header")).toHaveTextContent(MODAL_TITLE);
      });
    });

    it("should render cart items when cart has items", async () => {
      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText("Test Book")).toBeInTheDocument();
        expect(screen.getByTestId("cart-image")).toHaveAttribute(
          "src",
          "http://localhost:1337/test-image.jpg"
        );
        expect(screen.getByTestId("delete-item-button")).toBeInTheDocument();
        expect(screen.getByTestId("edit-quantity-minus")).toBeInTheDocument();
        expect(screen.getByTestId("edit-quantity-plus")).toBeInTheDocument();
      });
    });

    it("should render empty cart message when cart is empty", async () => {
      mockUseCart.mockReturnValue({
        cart: { ...mockCart, cartItems: [] },
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText(EMPTY_CART_MESSAGE)).toBeInTheDocument();
        expect(screen.getByTestId("shopping-cart-icon")).toBeInTheDocument();
      });
    });

    it("should render subtotal correctly", async () => {
      const { formatUSD } = require("@/utils/currency");
      formatUSD.mockReturnValue("$59.98");

      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText(SUBTOTAL_LABEL)).toBeInTheDocument();
        const modalFooter = screen.getByTestId("modal-footer");
        expect(modalFooter).toHaveTextContent("$59.98");
      });
    });

    it("should render close button", async () => {
      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const closeButton = screen.getByText(CLOSE_BUTTON_TEXT);
        expect(closeButton).toBeInTheDocument();
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

    it("should not call createCart when cart exists", () => {
      const { createCart } = require("@/services/cart");

      render(<CartModal />);

      expect(createCart).not.toHaveBeenCalled();
    });
  });

  describe("Custom Image URL", () => {
    it("should use custom base image URL when provided", async () => {
      render(<CartModal baseImageUrl="https://custom.com" />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const image = screen.getByTestId("cart-image");
        expect(image).toHaveAttribute("src", "https://custom.com/test-image.jpg");
      });
    });
  });

  describe("Modal Behavior", () => {
    it("should pass correct class names to modal", async () => {
      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const modal = screen.getByTestId("modal");
        const classNames = JSON.parse(modal.getAttribute("data-class-names") || "{}");
        expect(classNames.body).toBe("py-6");
        expect(classNames.header).toBe("bg-secondary text-primary");
      });
    });

    it("should display correct quantity in cart items", async () => {
      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText("2")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle cart item without book", async () => {
      const cartItemWithoutBook = {
        ...mockCartItem,
        book: null,
      };

      mockUseCart.mockReturnValue({
        cart: { ...mockCart, cartItems: [cartItemWithoutBook] },
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal")).toBeInTheDocument();
      });
    });

    it("should handle missing image URL", async () => {
      const cartItemWithoutImage = {
        ...mockCartItem,
        book: {
          ...mockCartItem.book!,
          imageUrl: "",
        },
      };

      mockUseCart.mockReturnValue({
        cart: { ...mockCart, cartItems: [cartItemWithoutImage] },
        updateCartItem: mockUpdateCartItem,
      });

      render(<CartModal />);

      const triggerButton = screen.getByTestId("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const image = screen.getByTestId("cart-image");
        expect(image).toHaveAttribute("src", "http://localhost:1337");
      });
    });
  });
});
