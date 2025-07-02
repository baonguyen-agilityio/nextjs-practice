"use client";

import type { CartItem } from "@/types";
import { useActionState, useCallback } from "react";
import { removeItem } from "@/app/actions";
import { Button } from "@/components/ui/Button";

interface DeleteItemButtonProps {
  item: CartItem;
  optimisticUpdate: any;
}

export function DeleteItemButton({ item, optimisticUpdate }: DeleteItemButtonProps) {
  const [_, formAction, isPending] = useActionState(removeItem, {
    success: null,
    message: "",
  });

  const bookId = item.book?.id || "";
  const cartItemId = item.documentId || "";
  const removeItemAction = formAction.bind(null, cartItemId);

  const handleFormSubmit = useCallback(async () => {
    optimisticUpdate(bookId, "delete");
    removeItemAction();
  }, [optimisticUpdate, bookId, removeItemAction]);

  return (
    <form action={handleFormSubmit}>
      <Button
        aria-label="Remove item from cart"
        disabled={isPending}
        isLoading={isPending}
        type="submit"
        variant="text"
        className="min-w-fit p-0"
      >
        Remove
      </Button>
    </form>
  );
}
