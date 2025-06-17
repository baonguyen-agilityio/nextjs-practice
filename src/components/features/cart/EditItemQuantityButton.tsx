"use client";

import type { CartItem } from "@/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateItemQuantity } from "@/app/actions/cart";
import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import debounce from "lodash/debounce";

export const DEBOUNCE_DELAY = 500;
export const INCREASE_ARIA_LABEL = "Increase item quantity";
export const DECREASE_ARIA_LABEL = "Reduce item quantity";

export type OptimisticUpdateFn = (bookId: string, updateType: "plus" | "minus" | "delete") => void;
export type QuantityUpdateType = "plus" | "minus";

export const calculateNewQuantity = (currentQuantity: number, type: QuantityUpdateType): number => {
  return type === "plus" ? currentQuantity + 1 : currentQuantity - 1;
};

export const getAriaLabel = (type: QuantityUpdateType): string => {
  return type === "plus" ? INCREASE_ARIA_LABEL : DECREASE_ARIA_LABEL;
};

export const getCartItemId = (item: CartItem): string => {
  return item.documentId || "";
};

export const getBookId = (item: CartItem): string => {
  return item.book?.id || "";
};

export const createDebouncedUpdate = (
  updateFn: (params: { cartItemId: string; quantity: number }) => void,
  delay: number = DEBOUNCE_DELAY
) => {
  return debounce(updateFn, delay);
};

export const getButtonProps = (type: QuantityUpdateType) => ({
  size: "sm" as const,
  variant: "light" as const,
  disableAnimation: true,
  isIconOnly: true,
  radius: "full" as const,
  "aria-label": getAriaLabel(type),
});

export const renderIcon = (type: QuantityUpdateType) => {
  const iconClass = "h-4 w-4";
  return type === "plus" ? <PlusIcon className={iconClass} /> : <MinusIcon className={iconClass} />;
};

interface EditItemQuantityButtonProps {
  item: CartItem;
  type: QuantityUpdateType;
  optimisticUpdate: OptimisticUpdateFn;
  onUpdateQuantity?: (params: { cartItemId: string; quantity: number }) => void;
  debounceDelay?: number;
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
  onUpdateQuantity,
  debounceDelay = DEBOUNCE_DELAY,
}: EditItemQuantityButtonProps) {
  const updateFunction = onUpdateQuantity || updateItemQuantity;

  const debouncedServerUpdate = useRef(
    createDebouncedUpdate(updateFunction, debounceDelay)
  ).current;

  const cartItemId = getCartItemId(item);
  const bookId = getBookId(item);
  const buttonProps = getButtonProps(type);
  const icon = renderIcon(type);

  const handleClick = useCallback(() => {
    optimisticUpdate(bookId, type);

    const newQuantity = calculateNewQuantity(item.quantity, type);
    debouncedServerUpdate({
      cartItemId,
      quantity: newQuantity,
    });
  }, [optimisticUpdate, bookId, type, debouncedServerUpdate, cartItemId, item.quantity]);

  return (
    <Button onClick={handleClick} {...buttonProps}>
      {icon}
    </Button>
  );
}
