"use client";

import { Card, CardFooter, CardBody, Image } from "@heroui/react";
import { formatUSD } from "@/utils/currency";
import AddToCart from "@/components/features/cart/AddToCart";

export default function BookCard(props: {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}) {
  const { id, title, price, description, imageUrl } = props;
  return (
    <Card className="shadow-none rounded-none">
      <CardBody className="bg-background flex items-center justify-center">
        <Image
          alt="Card background"
          className="w-full object-cover p-6"
          src={imageUrl}
          width="100%"
        />
      </CardBody>
      <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-5xl">{title}</p>
          <p className="text-accent font-inter text-lg font-bold">{formatUSD(price)}</p>
        </div>
        <p className="text-description font-inter text-xs">{description}</p>
        <div className="space-y-2">
          <AddToCart variant="order" bookId={id} quantity={1} />
        </div>
      </CardFooter>
    </Card>
  );
}
