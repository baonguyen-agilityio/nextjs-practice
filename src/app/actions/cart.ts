"use server";

import { TAGS } from "@/constants";
import { auth } from "@/lib/auth/auth";
import { addCartItem, getCartByUserId, updateCartItem } from "@/services/cart";
import { revalidateTag } from "next/cache";

export async function addItem(prevState: any, bookId: string) {
  const session = await auth();
  if (!session) {
    return "UNAUTHORIZED";
  }

  const cart = await getCartByUserId();

  try {
    await addCartItem({ bookId, quantity: 1, cartId: cart?.id || "" });
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
