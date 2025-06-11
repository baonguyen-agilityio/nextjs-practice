"use client";

import type { CartItem } from "@/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateItemQuantity } from "@/app/actions/cart";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import debounce from "lodash/debounce";

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
}) {
  const debouncedServerUpdate = useRef(
    debounce((quantity: number) => {
      updateItemQuantity({
        cartItemId: item.documentId || "",
        quantity,
      });
    }, 500)
  ).current;

  return (
    <Button
      onClick={() => {
        const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
        optimisticUpdate(item.documentId, newQuantity);
        debouncedServerUpdate(newQuantity);
      }}
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
