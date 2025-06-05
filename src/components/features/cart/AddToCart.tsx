"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { addToCart } from "@/app/actions";

function SubmitButton({ variant }: { variant: "order" | "add" }) {
  if (variant === "order") {
    return (
      <Button aria-label="Order Today" type="submit" variant="bordered">
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

export default function AddToCart({
  variant,
  bookId,
  quantity,
}: {
  variant: "order" | "add";
  bookId: string;
  quantity: number;
}) {
  const [state, formAction] = useActionState(addToCart, null);
  console.log("state", state);
  const actionWithVariant = formAction.bind(null, { bookId, quantity });

  return (
    <form action={actionWithVariant}>
      <SubmitButton variant={variant} />
    </form>
  );
}
