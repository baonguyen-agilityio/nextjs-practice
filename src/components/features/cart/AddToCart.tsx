"use client";

import { useActionState } from "react";

import { useCart } from "@/hooks/useCart";
import type { Book } from "@/types";
import { addItem } from "@/app/actions/cart";
import { Button } from "@/components/ui/Button";

function SubmitButton({ variant }: { variant: "order" | "add" }) {
  if (variant === "order") {
    return (
      <Button aria-label="Order Today" color="primary" type="submit" variant="ghost">
        Order Today
      </Button>
    );
  }
  return (
    <Button type="submit" aria-label="Add to cart" variant="solid">
      Add To Cart
    </Button>
  );
}

export function AddToCart({ book, variant }: { book: Book; variant: "order" | "add" }) {
  const { addCartItem } = useCart();
  const { id } = book;
  const [message, formAction] = useActionState(addItem, null);
  const addItemAction = formAction.bind(null, id);

  return (
    <form
      action={async () => {
        addCartItem(book);
        addItemAction();
      }}
    >
      <SubmitButton variant={variant} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
