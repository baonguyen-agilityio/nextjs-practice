/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useActionState, useState, useCallback } from "react";
import { addItem } from "@/app/actions";
import { formatUSD } from "@/utils/currency";
import type { Book } from "@/types";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;
const DEFAULT_QUANTITY = 1;

export const createImageUrl = (baseUrl: string | undefined, imageUrl: string) => {
  return `${baseUrl || ""}${imageUrl}`;
};

export const validateQuantity = (value: number): number => {
  return Math.max(MIN_QUANTITY, Math.min(value, MAX_QUANTITY));
};

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
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);
  const { addCartItem } = useCart();
  const [message, formAction, isPending] = useActionState(addItem, null);

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

  const imageUrl = createImageUrl(process.env.NEXT_PUBLIC_STRAPI_URL, book.imageUrl);
  const formattedPrice = `${formatUSD(book.price)} USD`;

  return (
    <section>
      <div className="flex justify-between mb-10">
        <Button variant="light" onClick={handleBackClick} className="text-description text-lg">
          ← Back to list
        </Button>
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex justify-center w-1/2 bg-background p-10">
          <Image alt={book.title} src={imageUrl} width={580} height={660} />
        </div>

        <div className="flex flex-col gap-8 w-1/2">
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
                onClick={() => handleButtonQuantityChange("minus")}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                classNames={{
                  input: "text-center text-lg",
                  inputWrapper: "bg-transparent shadow-none outline-none",
                }}
                disableAnimation
                value={`${quantity}`}
                onChange={handleQuantityChange}
              />
              <Button variant="light" isIconOnly onClick={() => handleButtonQuantityChange("plus")}>
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
