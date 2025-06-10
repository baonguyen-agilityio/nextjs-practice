"use server";

import { TAGS } from "@/constants";
import { auth } from "@/lib/auth/auth";
import { addCartItem, getCartByUserId, removeCartItem, updateCartItem } from "@/services/cart";
import { revalidateTag } from "next/cache";

export async function addItem(prevState: any, payload: { bookId: string; quantity: number }) {
  const session = await auth();
  if (!session) {
    return "UNAUTHORIZED";
  }

  const cart = await getCartByUserId();

  try {
    await addCartItem({
      bookId: payload.bookId,
      quantity: payload.quantity,
      cartId: cart?.id || "",
    });
    revalidateTag(TAGS.cart);
  } catch (e) {
    console.log("error", e);
    return "Error adding item to cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: { cartItemId: string; quantity: number }
) {
  try {
    await updateCartItem(payload);
    revalidateTag(TAGS.cart);
  } catch (e) {
    console.log("error", e);
    return "Error updating item quantity";
  }
}

export const removeItem = async (prevState: any, cartItemId: string) => {
  try {
    await removeCartItem({ cartItemId });
    revalidateTag(TAGS.cart);
  } catch (e) {
    console.log("error", e);
    return "Error removing item from cart";
  }
};
