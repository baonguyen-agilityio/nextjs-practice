import { auth } from "@/lib/auth/auth";
import CartModal from "./CartModal";
import { getCartByUserId } from "@/services/cart";

export default async function Cart() {
  const session = await auth();

  let cart;
  if (session?.user?.id) {
    const searchParams = new URLSearchParams({
      "filters[users_permissions_user][id][$eq]": session.user.id.toString(),
    });
    cart = await getCartByUserId({ searchParams });
  }

  return <CartModal cart={cart} />;
}
