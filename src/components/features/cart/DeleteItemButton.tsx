"use client";

import type { CartItem } from "@/types";
import { useActionState, useCallback, useEffect } from "react";
import { removeItem } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { addToast } from "@heroui/react";

interface DeleteItemButtonProps {
  item: CartItem;
  optimisticUpdate: any;
}

export function DeleteItemButton({ item, optimisticUpdate }: DeleteItemButtonProps) {
  const [result, formAction, isPending] = useActionState(removeItem, {
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

  useEffect(() => {
    if (result?.success) {
      addToast({
        title: result.message,
        color: "success",
      });
    }
    if (result?.success === false) {
      addToast({
        title: result.message,
        color: "danger",
      });
    }
  }, [result]);

  return (
    <form action={handleFormSubmit}>
      <Button
        aria-label="Remove item from cart"
        disabled={isPending}
        isLoading={isPending}
        type="submit"
        variant="text"
      >
        Remove
      </Button>
    </form>
  );
}
