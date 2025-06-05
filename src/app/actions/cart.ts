"use server";

import { TAGS } from "@/constants";
import { auth } from "@/lib/auth/auth";
import { addCartItem, createCart, getCartByUserId } from "@/services/cart";
import { revalidateTag } from "next/cache";

export async function addToCart(
  _: any,
  { bookId, quantity }: { bookId: string; quantity: number }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "User not found" };
  }
  const searchParams = new URLSearchParams({
    "filters[users_permissions_user][id][$eq]": session.user.id.toString(),
  });

  let cart = await getCartByUserId({ searchParams });

  if (!cart.id) {
    cart = await createCart({ userId: session.user.id });
  }

  try {
    await addCartItem({ bookId, quantity, cartId: cart.id });
    revalidateTag(TAGS.cart);
  } catch (error) {
    console.log("error", error);
    return "Error adding item to cart";
  }
}
