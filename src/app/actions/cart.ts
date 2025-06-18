"use server";

import { TAGS } from "@/constants";
import { auth } from "@/lib/auth/auth";
import { addCartItem, getCartByUserId, removeCartItem, updateCartItem } from "@/services/cart";
import { revalidateTag } from "next/cache";

type ActionState = {
  success: boolean | null;
  message: string;
};

export async function addItem(
  prevState: ActionState,
  payload: { bookId: string; quantity: number }
): Promise<ActionState> {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: "UNAUTHORIZED",
    };
  }

  const cart = await getCartByUserId();

  try {
    await addCartItem({
      bookId: payload.bookId,
      quantity: payload.quantity,
      cartId: cart?.id || "",
    });
    revalidateTag(TAGS.CART);
    return {
      success: true,
      message: "Successfully added item to cart",
    };
  } catch (e) {
    console.log("error", e);
    return {
      success: false,
      message: "Error adding item to cart",
    };
  }
}

export async function updateItemQuantity(
  prevState: ActionState,
  payload: { cartItemId: string; quantity: number }
): Promise<ActionState> {
  try {
    await updateCartItem(payload);
    revalidateTag(TAGS.CART);
    return {
      success: true,
      message: "Successfully updated item quantity",
    };
  } catch (e) {
    console.log("error", e);
    return {
      success: false,
      message: "Error updating item quantity",
    };
  }
}

export const removeItem = async (
  prevState: ActionState,
  cartItemId: string
): Promise<ActionState> => {
  try {
    await removeCartItem({ cartItemId });
    revalidateTag(TAGS.CART);
    return {
      success: true,
      message: "Successfully removed item from cart",
    };
  } catch (e) {
    console.log("error", e);
    return {
      success: false,
      message: "Error removing item from cart",
    };
  }
};
