/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { CartItem } from "@/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateItemQuantity } from "@/app/actions/cart";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <Button
      type="submit"
      size="sm"
      aria-label={type === "plus" ? "Increase item quantity" : "Reduce item quantity"}
      variant="light"
      disableAnimation
      isIconOnly
      radius="full"
    >
      {type === "plus" ? <PlusIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
    </Button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    cartItemId: item.documentId || "",
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(item.book.id, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
    </form>
  );
}
