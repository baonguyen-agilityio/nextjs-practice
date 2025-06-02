"use client";

import { Card, CardFooter, CardBody, Image } from "@heroui/react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { formatUSD } from "@/utils/currency";

export default function BookCard(props: {
  title: string;
  price: number;
  description: string;
  image: string;
  href: string;
}) {
  const { title, price, description, image, href } = props;
  const router = useRouter();
  return (
    <Card className="shadow-none rounded-none">
      <CardBody className="bg-background flex items-center justify-center">
        <Image alt="Card background" className="w-full object-cover p-6" src={image} width="100%" />
      </CardBody>
      <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-5xl">{title}</p>
          <p className="text-accent font-inter text-lg font-bold">{formatUSD(price)}</p>
        </div>
        <p className="text-description font-inter text-xs">{description}</p>
        <div className="space-y-2">
          <Button variant="bordered" onClick={() => router.push(href)}>
            Order Today
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
