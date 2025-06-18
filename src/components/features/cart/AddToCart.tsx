"use client";

import { useActionState, useEffect } from "react";

import { useCart } from "@/hooks/useCart";
import type { Book } from "@/types";
import { addItem } from "@/app/actions/cart";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

function SubmitButton({ variant, isPending }: { variant: "order" | "add"; isPending: boolean }) {
  if (variant === "order") {
    return (
      <Button
        aria-label="Order Today"
        color="primary"
        disabled={isPending}
        isLoading={isPending}
        type="submit"
        variant="ghost"
      >
        Order Today
      </Button>
    );
  }
  return (
    <Button disabled={isPending} type="submit" aria-label="Add to cart" variant="solid">
      Add To Cart
    </Button>
  );
}

export function AddToCart({ book, variant }: { book: Book; variant: "order" | "add" }) {
  const router = useRouter();

  const { addCartItem } = useCart();
  const { id } = book;
  const [result, formAction, isPending] = useActionState(addItem, {
    success: null,
    message: "",
  });
  const addItemAction = formAction.bind(null, { bookId: id, quantity: 1 });

  useEffect(() => {
    if (result?.message === "UNAUTHORIZED") {
      addToast({
        title: "You must be logged in to add items to your cart",
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
      router.push("/login");
    }
  }, [result, router]);

  useEffect(() => {
    if (result?.success) {
      addToast({
        title: result.message,
        color: "success",
        shouldShowTimeoutProgress: true,
      });
    }
    if (result?.success === false && result?.message !== "UNAUTHORIZED") {
      addToast({
        title: "Failed to add item to cart",
        color: "danger",
        shouldShowTimeoutProgress: true,
      });
    }
  }, [result]);

  return (
    <form
      action={async () => {
        addCartItem(book, 1);
        addItemAction();
      }}
    >
      <SubmitButton variant={variant} isPending={isPending} />
    </form>
  );
}
