"use client";

import type { CartItem } from "@/types";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { updateItemQuantity } from "@/app/actions/cart";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { addToast } from "@heroui/react";

function SubmitButton({ type, isLoading }: { type: "plus" | "minus"; isLoading: boolean }) {
  return (
    <Button
      type="submit"
      size="sm"
      aria-label={type === "plus" ? "Increase item quantity" : "Reduce item quantity"}
      variant="light"
      disableAnimation
      data-hover="bg-transparent"
      isIconOnly
      radius="full"
      isLoading={isLoading}
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
  const [result, formAction, isPending] = useActionState(updateItemQuantity, {
    success: null,
    message: "",
  });
  const payload = {
    cartItemId: item.documentId || "",
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  useEffect(() => {
    if (result?.success) {
      addToast({
        title: result.message,
        color: "success",
      });
    }
    if (result?.success === false) {
      addToast({
        title: "Failed to update item quantity",
        color: "danger",
      });
    }
  }, [result]);

  return (
    <form
      action={async () => {
        optimisticUpdate(item.book.id, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} isLoading={isPending} />
    </form>
  );
}
