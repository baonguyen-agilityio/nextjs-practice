"use client";

import { useActionState, useState, useCallback, useEffect } from "react";
import { addItem } from "@/app/actions";
import { formatUSD } from "@/utils/currency";
import type { Book } from "@/types";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { createImageUrl, validateQuantity } from "@/utils";
import { MIN_QUANTITY } from "@/constants";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

export const handleNavigation = (onNavigate?: () => void) => {
  if (onNavigate) {
    onNavigate();
  } else {
    window.history.back();
  }
};

interface BookDetailsProps {
  book: Book;
  onNavigateBack?: () => void;
}

export function BookDetails({ book, onNavigateBack }: BookDetailsProps) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const { addCartItem } = useCart();
  const [result, formAction, isPending] = useActionState(addItem, {
    success: null,
    message: "",
  });
  const router = useRouter();
  const handleButtonQuantityChange = useCallback((type: "plus" | "minus") => {
    setQuantity((prev) => {
      const newValue = type === "plus" ? prev + 1 : prev - 1;
      return validateQuantity(newValue);
    });
  }, []);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(validateQuantity(value));
  }, []);

  const handleFormSubmit = useCallback(async () => {
    addCartItem(book, quantity);
    const payload = {
      bookId: book.id,
      quantity: quantity,
    };
    const updateItemQuantityAction = formAction.bind(null, payload);
    updateItemQuantityAction();
  }, [addCartItem, book, quantity, formAction]);

  const handleBackClick = useCallback(() => {
    handleNavigation(onNavigateBack);
  }, [onNavigateBack]);

  const imageUrl = createImageUrl(book.imageUrl);
  const formattedPrice = `${formatUSD(book.price)} USD`;

  useEffect(() => {
    if (result?.message === "UNAUTHORIZED") {
      addToast({
        title: "You must be logged in to add items to your cart",
        color: "danger",
      });
      router.push("/login");
    }
  }, [result, router]);

  useEffect(() => {
    if (result?.success) {
      addToast({
        title: result.message,
        color: "success",
      });
    }
    if (result?.success === false && result?.message !== "UNAUTHORIZED") {
      addToast({
        title: "Failed to add item to cart",
        color: "danger",
      });
    }
  }, [result]);

  return (
    <section>
      <div className="flex justify-between mb-10">
        <Button variant="light" onClick={handleBackClick} className="text-description text-lg">
          ← Back to list
        </Button>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex justify-center w-full md:w-1/2 bg-background p-6 md:p-10">
          <div className="w-full max-w-[580px] aspect-[580/660] relative">
            <Image
              alt={book.title}
              src={imageUrl}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full md:w-1/2">
          <div className="flex flex-col gap-6">
            <p className="text-title text-5xl">{book.title}</p>
            <p className="text-secondary font-inter text-lg font-bold">{formattedPrice}</p>
            <p className="text-description font-inter text-xs">{book.description}</p>
          </div>
          <form action={handleFormSubmit} className="flex gap-2">
            <div className="ml-auto flex h-15 flex-row items-center border border-secondary">
              <Button
                variant="light"
                isIconOnly
                aria-label="Decrease quantity"
                onClick={() => handleButtonQuantityChange("minus")}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                aria-label="Book quantity"
                classNames={{
                  input: "text-center text-lg",
                  inputWrapper: "bg-transparent shadow-none outline-none",
                }}
                disableAnimation
                value={`${quantity}`}
                onChange={handleQuantityChange}
              />
              <Button
                variant="light"
                isIconOnly
                aria-label="Increase quantity"
                onClick={() => handleButtonQuantityChange("plus")}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button
              isLoading={isPending}
              isDisabled={quantity === 0}
              type="submit"
              fullWidth
              color="secondary"
            >
              Add to Cart
            </Button>
          </form>

          <div className="space-y-2" />
        </div>
      </div>
    </section>
  );
}
