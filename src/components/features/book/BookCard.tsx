"use client";

import { Card, CardFooter } from "@heroui/react";
import { formatUSD } from "@/utils/currency";
import { AddToCart } from "@/components/features/cart/AddToCart";
import type { Book, Category } from "@/types";
import EditBookModal from "@/components/features/book/EditBookModal";
import DeleteBookModal from "./DeleteBookModal";
import Image from "next/image";

export default function BookCard(props: { book: Book; isAdmin: boolean; categories: Category[] }) {
  const { book, isAdmin, categories } = props;
  return (
    <Card className="shadow-none rounded-none h-full flex flex-col">
      <div className="p-0">
        <div className="w-full h-[450px] relative overflow-hidden bg-background">
          <Image
            alt={book.title}
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${book.imageUrl}`}
            className="object-cover p-6"
            fill
            priority
          />
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
              <EditBookModal book={book} categories={categories} />
              <DeleteBookModal book={book} />
            </>
          ) : (
            <AddToCart book={book} variant="order" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
