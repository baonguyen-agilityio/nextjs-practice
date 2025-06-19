"use client";

import { Card, CardFooter } from "@heroui/react";
import { formatUSD } from "@/utils/currency";
import { AddToCart } from "@/components/features/cart/AddToCart";
import type { Book, Category } from "@/types";
import { LazyEditBookModal, LazyDeleteBookModal } from "./DynamicModals";
import Image from "next/image";
import type { ActionResult } from "@/app/actions/book";
import { createImageUrl } from "@/utils/image";

export default function BookCard(props: {
  book: Book;
  isAdmin: boolean;
  categories: Category[];
  formAction: (payload: FormData) => void;
  isPendingUpdateBook: boolean;
  result: ActionResult | undefined;
  formActionDelete: (payload: FormData) => void;
  isPendingDelete: boolean;
}) {
  const {
    book,
    isAdmin,
    categories,
    formAction,
    isPendingUpdateBook,
    result,
    formActionDelete,
    isPendingDelete,
  } = props;

  return (
    <Card className="shadow-none rounded-none h-full flex flex-col">
      <div className="p-0">
        <div className="w-full h-[650px] relative overflow-hidden bg-background p-6">
          <div className="w-full h-full relative">
            <Image
              data-testid="book-image"
              alt={book.title}
              src={createImageUrl(book.imageUrl)}
              className="object-contain"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>

      <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0 flex-grow">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-5xl">{book.title}</p>
          <p className="text-accent font-inter text-lg font-bold">{formatUSD(book.price)}</p>
        </div>
        <p className="text-description font-inter text-xs">{book.description}</p>

        <div className="space-y-2 w-full mt-auto">
          {isAdmin ? (
            <>
              <LazyEditBookModal
                book={book}
                categories={categories}
                formAction={formAction}
                isPending={isPendingUpdateBook}
                result={result}
              />
              <LazyDeleteBookModal
                book={book}
                formActionDelete={formActionDelete}
                isPendingDelete={isPendingDelete}
              />
            </>
          ) : (
            <AddToCart book={book} variant="order" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
