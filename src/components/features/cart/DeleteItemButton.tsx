"use client";

import type { CartItem } from "@/types";
import { useActionState, useCallback } from "react";
import { removeItem } from "@/app/actions";
import { Button } from "@/components/ui/Button";

export const REMOVE_BUTTON_TEXT = "Remove";

export type OptimisticUpdateFn = (bookId: string, updateType: "delete") => void;

export const getBookId = (item: CartItem): string => {
  return item.book?.id || "";
};

export const getCartItemId = (item: CartItem): string => {
  return item.documentId || "";
};

export const createRemoveAction = (formAction: any, cartItemId: string) => {
  return formAction.bind(null, cartItemId);
};

export const handleOptimisticUpdate = (
  optimisticUpdate: OptimisticUpdateFn,
  bookId: string
): void => {
  optimisticUpdate(bookId, "delete");
};

export const getButtonProps = () => ({
  type: "submit" as const,
  variant: "light" as const,
  color: "default" as const,
  size: "lg" as const,
  fullWidth: true,
});

interface DeleteItemButtonProps {
  item: CartItem;
  optimisticUpdate: OptimisticUpdateFn;
  onRemoveOverride?: (cartItemId: string) => Promise<any>;
}

export function DeleteItemButton({
  item,
  optimisticUpdate,
  onRemoveOverride,
}: DeleteItemButtonProps) {
  const [message, formAction] = useActionState(onRemoveOverride || removeItem, null);

  const bookId = getBookId(item);
  const cartItemId = getCartItemId(item);
  const removeItemAction = createRemoveAction(formAction, cartItemId);
  const buttonProps = getButtonProps();

  const handleFormSubmit = useCallback(async () => {
    handleOptimisticUpdate(optimisticUpdate, bookId);
    removeItemAction();
  }, [optimisticUpdate, bookId, removeItemAction]);

  return (
    <form action={handleFormSubmit}>
      <Button {...buttonProps}>{REMOVE_BUTTON_TEXT}</Button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
