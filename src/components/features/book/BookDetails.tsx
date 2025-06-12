/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useActionState, useState } from "react";
import { addItem } from "@/app/actions";
import { formatUSD } from "@/utils/currency";
import type { Book } from "@/types";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export function BookDetails({ book }: { book: Book }) {
  const [quantity, setQuantity] = useState(1);
  const { addCartItem } = useCart();
  const [message, formAction, isPending] = useActionState(addItem, null);

  const handleButtonQuantityChange = (type: "plus" | "minus") => {
    setQuantity((prev) => {
      if (type === "plus") return Math.min(prev + 1, 10);
      return Math.max(1, prev - 1);
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(Math.min(Number(value), 10));
  };

  const payload = {
    bookId: book.id,
    quantity: quantity,
  };

  const updateItemQuantityAction = formAction.bind(null, payload);
  return (
    <section>
      <div className="flex justify-between mb-10">
        <Button
          variant="light"
          onClick={() => window.history.back()}
          className="text-description text-lg"
        >
          ← Back to list
        </Button>
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex justify-center w-1/2 bg-background p-10">
          <Image
            alt={book.title}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${book.imageUrl}`}
            width={580}
            height={660}
          />
        </div>

        <div className="flex flex-col gap-8 w-1/2">
          <div className="flex flex-col gap-6">
            <p className="text-title text-5xl">{book.title}</p>
            <p className="text-secondary font-inter text-lg font-bold">{`${formatUSD(book.price)} USD`}</p>
            <p className="text-description font-inter text-xs">{book.description}</p>
          </div>
          <form
            action={async () => {
              addCartItem(book, quantity);
              updateItemQuantityAction();
            }}
            className="flex gap-2"
          >
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
