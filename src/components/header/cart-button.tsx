import Link from "next/link";
import CartIcon from "../icons/cart-icon";

export function CartButton({ count = 1 }: { count?: number }) {
  return (
    <Link href="/cart" className="hover:opacity-80 transition-opacity relative inline-block">
      <CartIcon />
      <span
        className="
          absolute -top-3 -right-3
          bg-accent text-darkblue
          rounded-full
          w-5 h-5 flex items-center justify-center
          font-bold text-xs font-inter
          shadow
        "
      >
        {count.toString().padStart(2, "0")}
      </span>
    </Link>
  );
}
