import CartIcon from "../../icons/cart-icon";

export function OpenCart({ quantity }: { quantity?: number }) {
  return (
    <div className="hover:opacity-80 transition-opacity relative inline-block">
      <CartIcon />
      {quantity ? (
        <span
          className="
            absolute -top-3 -right-3
            bg-secondary text-primary   
            rounded-full
            w-6 h-6 flex items-center justify-center
            font-bold text-[10px] font-inter
            shadow
            "
        >
          {quantity > 99 ? "99+" : quantity}
        </span>
      ) : null}
    </div>
  );
}
