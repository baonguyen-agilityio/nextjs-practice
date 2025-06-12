"use client";

import { Card, CardFooter, CardBody, Image } from "@heroui/react";
import { formatUSD } from "@/utils/currency";
import { AddToCart } from "@/components/features/cart/AddToCart";
import type { Book } from "@/types";
import EditBookModal from "@/components/features/book/EditBookModal";
import DeleteBookModal from "./DeleteBookModal";

export default function BookCard(props: { book: Book; isAdmin: boolean }) {
  const { book, isAdmin } = props;
  return (
    <Card className="shadow-none rounded-none">
      <CardBody className="bg-background flex items-center justify-center">
        <Image
          alt="Card background"
          className="w-full object-cover p-6"
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${book.imageUrl}`}
          width="100%"
        />
      </CardBody>
      <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-5xl">{book.title}</p>
          <p className="text-accent font-inter text-lg font-bold">{formatUSD(book.price)}</p>
        </div>
        <p className="text-description font-inter text-xs">{book.description}</p>
        {isAdmin ? (
          <div className="space-y-2 w-full">
            <EditBookModal book={book} />
            <DeleteBookModal book={book} />
          </div>
        ) : (
          <div className="space-y-2 w-full">
            <AddToCart book={book} variant="order" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
