import { addItem, updateItemQuantity, removeItem } from "../cart";
import { auth } from "@/lib/auth/auth";
import { addCartItem, getCartByUserId, removeCartItem, updateCartItem } from "@/services/cart";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/constants";

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/services/cart", () => ({
  addCartItem: jest.fn(),
  getCartByUserId: jest.fn(),
  removeCartItem: jest.fn(),
  updateCartItem: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

jest.mock("@/constants", () => ({
  TAGS: {
    CART: "cart",
  },
}));

const mockAuth = auth as any;
const mockAddCartItem = addCartItem as any;
const mockGetCartByUserId = getCartByUserId as any;
const mockRemoveCartItem = removeCartItem as any;
const mockUpdateCartItem = updateCartItem as any;
const mockRevalidateTag = revalidateTag as any;

describe("Cart Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("addItem", () => {
    it("should successfully add item to cart", async () => {
      const payload = { bookId: "book-123", quantity: 2 };
      const mockSession = { user: { id: "user-123" } };
      const mockCart = {
        id: "cart-456",
        cartItems: [],
        totalQuantity: 0,
      };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(mockCart);
      mockAddCartItem.mockResolvedValue({
        id: "item-123",
        quantity: 2,
        book: {},
      });

      const result = await addItem({ success: null, message: "" }, payload);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockGetCartByUserId).toHaveBeenCalled();
      expect(mockAddCartItem).toHaveBeenCalledWith({
        bookId: "book-123",
        quantity: 2,
        cartId: "cart-456",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toEqual({
        success: true,
        message: "Successfully added item to cart",
      });
    });

    it("should return UNAUTHORIZED when no session", async () => {
      const payload = { bookId: "book-123", quantity: 2 };

      mockAuth.mockResolvedValue(null);

      const result = await addItem({ success: null, message: "" }, payload);

      expect(result).toEqual({
        success: false,
        message: "UNAUTHORIZED",
      });
    });

    it("should handle addCartItem error", async () => {
      const payload = { bookId: "book-123", quantity: 2 };
      const mockSession = { user: { id: "user-123" } };
      const mockCart = {
        id: "cart-456",
        cartItems: [],
        totalQuantity: 0,
      };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(mockCart);
      mockAddCartItem.mockRejectedValue(new Error("Database error"));

      const result = await addItem({ success: null, message: "" }, payload);

      expect(result).toEqual({
        success: false,
        message: "Error adding item to cart",
      });
    });

    it("should handle empty cart", async () => {
      const payload = { bookId: "book-123", quantity: 2 };
      const mockSession = { user: { id: "user-123" } };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(undefined);
      mockAddCartItem.mockResolvedValue({
        id: "item-123",
        quantity: 2,
        book: {},
      });

      const result = await addItem({ success: null, message: "" }, payload);

      expect(mockAddCartItem).toHaveBeenCalledWith({
        bookId: "book-123",
        quantity: 2,
        cartId: "",
      });
      expect(result).toEqual({
        success: true,
        message: "Successfully added item to cart",
      });
    });
  });

  describe("updateItemQuantity", () => {
    it("should successfully update item quantity", async () => {
      const payload = { cartItemId: "item-123", quantity: 3 };

      mockUpdateCartItem.mockResolvedValue({
        id: "item-123",
        quantity: 3,
        book: {},
      });

      const result = await updateItemQuantity({ success: null, message: "" }, payload);

      expect(mockUpdateCartItem).toHaveBeenCalledWith(payload);
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toEqual({
        success: true,
        message: "Successfully updated item quantity",
      });
    });

    it("should handle updateCartItem error", async () => {
      const payload = { cartItemId: "item-123", quantity: 3 };

      mockUpdateCartItem.mockRejectedValue(new Error("Update failed"));

      const result = await updateItemQuantity({ success: null, message: "" }, payload);

      expect(result).toEqual({
        success: false,
        message: "Error updating item quantity",
      });
    });
  });

  describe("removeItem", () => {
    it("should successfully remove item from cart", async () => {
      const cartItemId = "item-123";

      mockRemoveCartItem.mockResolvedValue({ success: true });

      const result = await removeItem({ success: null, message: "" }, cartItemId);

      expect(mockRemoveCartItem).toHaveBeenCalledWith({ cartItemId });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toEqual({
        success: true,
        message: "Successfully removed item from cart",
      });
    });

    it("should handle removeCartItem error", async () => {
      const cartItemId = "item-123";

      mockRemoveCartItem.mockRejectedValue(new Error("Remove failed"));

      const result = await removeItem({ success: null, message: "" }, cartItemId);

      expect(result).toEqual({
        success: false,
        message: "Error removing item from cart",
      });
    });
  });
});
