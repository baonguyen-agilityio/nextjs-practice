"use client";

import type { CartItem } from "@/types";
import { useActionState } from "react";
import { removeItem } from "@/app/actions";
import { Button } from "@/components/ui/Button";

type OptimisticUpdateFn = (bookId: string, updateType: "delete") => void;

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: OptimisticUpdateFn;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const bookId = item.book.id;
  const cartItemId = item.documentId || "";
  const removeItemAction = formAction.bind(null, cartItemId);

  return (
    <form
      action={async () => {
        optimisticUpdate(bookId, "delete");
        removeItemAction();
      }}
    >
      <Button type="submit" variant="light" color="default" size="lg" fullWidth>
        Remove
      </Button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
