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
      const mockCart = { id: "cart-456" };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(mockCart);
      mockAddCartItem.mockResolvedValue(undefined);

      const result = await addItem(null, payload);

      expect(mockAuth).toHaveBeenCalledWith();
      expect(mockGetCartByUserId).toHaveBeenCalledWith();
      expect(mockAddCartItem).toHaveBeenCalledWith({
        bookId: "book-123",
        quantity: 2,
        cartId: "cart-456",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });

    it("should handle empty cart id", async () => {
      const payload = { bookId: "book-123", quantity: 2 };
      const mockSession = { user: { id: "user-123" } };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(null);
      mockAddCartItem.mockResolvedValue(undefined);

      const result = await addItem(null, payload);

      expect(mockAuth).toHaveBeenCalledWith();
      expect(mockGetCartByUserId).toHaveBeenCalledWith();
      expect(mockAddCartItem).toHaveBeenCalledWith({
        bookId: "book-123",
        quantity: 2,
        cartId: "",
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });

    it("should return UNAUTHORIZED when no session", async () => {
      const payload = { bookId: "book-123", quantity: 2 };

      mockAuth.mockResolvedValue(null);

      const result = await addItem(null, payload);

      expect(mockAuth).toHaveBeenCalledWith();
      expect(mockGetCartByUserId).not.toHaveBeenCalled();
      expect(mockAddCartItem).not.toHaveBeenCalled();
      expect(mockRevalidateTag).not.toHaveBeenCalled();
      expect(result).toBe("UNAUTHORIZED");
    });

    it("should handle addCartItem error", async () => {
      const payload = { bookId: "book-123", quantity: 2 };
      const mockSession = { user: { id: "user-123" } };
      const mockCart = { id: "cart-456" };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(mockCart);
      mockAddCartItem.mockRejectedValue(new Error("Database error"));

      const result = await addItem(null, payload);

      expect(mockAuth).toHaveBeenCalledWith();
      expect(mockGetCartByUserId).toHaveBeenCalledWith();
      expect(mockAddCartItem).toHaveBeenCalledWith({
        bookId: "book-123",
        quantity: 2,
        cartId: "cart-456",
      });
      expect(mockRevalidateTag).not.toHaveBeenCalled();
      expect(result).toBe("Error adding item to cart");
    });

    it("should handle previous state parameter", async () => {
      const payload = { bookId: "book-123", quantity: 2 };
      const mockSession = { user: { id: "user-123" } };
      const mockCart = { id: "cart-456" };

      mockAuth.mockResolvedValue(mockSession);
      mockGetCartByUserId.mockResolvedValue(mockCart);
      mockAddCartItem.mockResolvedValue(undefined);

      const result = await addItem("previous error", payload);

      expect(result).toBe(null);
    });
  });

  describe("updateItemQuantity", () => {
    it("should successfully update item quantity", async () => {
      const payload = { cartItemId: "item-123", quantity: 3 };

      mockUpdateCartItem.mockResolvedValue(undefined);

      const result = await updateItemQuantity(payload);

      expect(mockUpdateCartItem).toHaveBeenCalledWith({
        cartItemId: "item-123",
        quantity: 3,
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });

    it("should handle updateCartItem error", async () => {
      const payload = { cartItemId: "item-123", quantity: 3 };

      mockUpdateCartItem.mockRejectedValue(new Error("Update failed"));

      const result = await updateItemQuantity(payload);

      expect(mockUpdateCartItem).toHaveBeenCalledWith({
        cartItemId: "item-123",
        quantity: 3,
      });
      expect(mockRevalidateTag).not.toHaveBeenCalled();
      expect(result).toBe("Error updating item quantity");
    });

    it("should handle zero quantity", async () => {
      const payload = { cartItemId: "item-123", quantity: 0 };

      mockUpdateCartItem.mockResolvedValue(undefined);

      const result = await updateItemQuantity(payload);

      expect(mockUpdateCartItem).toHaveBeenCalledWith({
        cartItemId: "item-123",
        quantity: 0,
      });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });
  });

  describe("removeItem", () => {
    it("should successfully remove item from cart", async () => {
      const cartItemId = "item-123";

      mockRemoveCartItem.mockResolvedValue(undefined);

      const result = await removeItem(null, cartItemId);

      expect(mockRemoveCartItem).toHaveBeenCalledWith({ cartItemId: "item-123" });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });

    it("should handle removeCartItem error", async () => {
      const cartItemId = "item-123";

      mockRemoveCartItem.mockRejectedValue(new Error("Remove failed"));

      const result = await removeItem(null, cartItemId);

      expect(mockRemoveCartItem).toHaveBeenCalledWith({ cartItemId: "item-123" });
      expect(mockRevalidateTag).not.toHaveBeenCalled();
      expect(result).toBe("Error removing item from cart");
    });

    it("should handle previous state parameter", async () => {
      const cartItemId = "item-123";

      mockRemoveCartItem.mockResolvedValue(undefined);

      const result = await removeItem("previous error", cartItemId);

      expect(mockRemoveCartItem).toHaveBeenCalledWith({ cartItemId: "item-123" });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });

    it("should handle empty cart item id", async () => {
      const cartItemId = "";

      mockRemoveCartItem.mockResolvedValue(undefined);

      const result = await removeItem(null, cartItemId);

      expect(mockRemoveCartItem).toHaveBeenCalledWith({ cartItemId: "" });
      expect(mockRevalidateTag).toHaveBeenCalledWith(TAGS.CART);
      expect(result).toBe(null);
    });
  });
});
