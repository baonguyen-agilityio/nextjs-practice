"use client";

import { useActionState, useState, useCallback, useEffect, useMemo } from "react";
import { addItem } from "@/app/actions";
import { formatUSD } from "@/utils/currency";
import type { Book } from "@/types";
import { useCart } from "@/hooks/useCart";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { createImageUrl, validateQuantity, sanitizeQuantityInput, ImageQuality } from "@/utils";
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
  const [inputValue, setInputValue] = useState(MIN_QUANTITY.toString());
  const { addCartItem } = useCart();
  const [result, formAction, isPending] = useActionState(addItem, {
    success: null,
    message: "",
  });
  const router = useRouter();

  const imageUrl = useMemo(() => createImageUrl(book.imageUrl), [book.imageUrl]);
  const formattedPrice = useMemo(() => `${formatUSD(book.price)} USD`, [book.price]);
  const isMinQuantity = quantity <= MIN_QUANTITY;

  const handleButtonQuantityChange = useCallback((type: "plus" | "minus") => {
    setQuantity((prev) => {
      const newValue = type === "plus" ? prev + 1 : prev - 1;
      const validatedValue = validateQuantity(newValue);
      setInputValue(validatedValue.toString());
      return validatedValue;
    });
  }, []);

  const handleQuantityInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      setInputValue("");
      return;
    }

    const sanitizedValue = sanitizeQuantityInput(rawValue);

    setInputValue(sanitizedValue);

    const numericValue = parseInt(sanitizedValue, 10);
    if (!isNaN(numericValue)) {
      const validatedQuantity = validateQuantity(numericValue);
      setQuantity(validatedQuantity);
    }
  }, []);

  const handleQuantityInputBlur = useCallback(() => {
    if (inputValue === "" || parseInt(inputValue, 10) !== quantity) {
      setInputValue(quantity.toString());
    }
  }, [inputValue, quantity]);

  const handleFormSubmit = useCallback(async () => {
    try {
      addCartItem(book, quantity);
      const payload = {
        bookId: book.id,
        quantity: quantity,
      };
      const updateItemQuantityAction = formAction.bind(null, payload);
      updateItemQuantityAction();
    } catch (error) {
      addToast({
        title: error instanceof Error ? error.message : "Failed to add item to cart",
        color: "danger",
      });
    }
  }, [addCartItem, book, quantity, formAction]);

  const handleBackClick = useCallback(() => {
    handleNavigation(onNavigateBack);
  }, [onNavigateBack]);

  useEffect(() => {
    if (result?.message === "UNAUTHORIZED") {
      addToast({
        title: "You must be logged in to add items to your cart",
        color: "danger",
      });
      router.push("/login");
      return;
    }

    if (result?.success) {
      addToast({
        title: result.message,
        color: "success",
      });
    } else if (result?.success === false) {
      addToast({
        title: "Failed to add item to cart",
        color: "danger",
      });
    }
  }, [result, router]);

  return (
    <section>
      <div className="flex justify-between mb-10">
        <Button variant="secondaryGhost" onClick={handleBackClick}>
          ← Back to list
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex justify-center bg-background p-6 md:p-10">
          <div className="w-full relative overflow-hidden">
            <ImageWithFallback
              alt={`Cover image of ${book.title} book`}
              src={imageUrl}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              width={480}
              height={640}
              quality={ImageQuality.HIGH}
              priority
              fallbackText="Book Cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full md:w-1/2">
          <div className="flex flex-col gap-6">
            <h1 className="text-title text-5xl">{book.title}</h1>
            <p className="text-secondary font-inter text-lg font-bold">{formattedPrice}</p>
            <p className="text-description font-inter text-xs">{book.description}</p>
          </div>

          <form action={handleFormSubmit} className="flex gap-2">
            <div className="ml-auto flex h-15 flex-row items-center border border-secondary">
              <Button
                variant="text"
                isIconOnly
                aria-label="Decrease quantity"
                disabled={isMinQuantity}
                onClick={() => handleButtonQuantityChange("minus")}
                className={isMinQuantity ? "opacity-50 cursor-not-allowed" : ""}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>

              <Input
                type="text"
                inputMode="numeric"
                aria-label="Book quantity"
                min={MIN_QUANTITY}
                classNames={{
                  input: "text-center text-lg",
                  inputWrapper: "bg-transparent shadow-none outline-none",
                }}
                disableAnimation
                value={inputValue}
                onChange={handleQuantityInputChange}
                onBlur={handleQuantityInputBlur}
                placeholder={MIN_QUANTITY.toString()}
              />

              <Button
                variant="text"
                isIconOnly
                aria-label="Increase quantity"
                onClick={() => handleButtonQuantityChange("plus")}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button isLoading={isPending} type="submit" fullWidth variant="secondary">
              Add to Cart
            </Button>
          </form>

          <div className="space-y-2" />
        </div>
      </div>
    </section>
  );
}
