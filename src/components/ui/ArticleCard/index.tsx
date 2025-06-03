"use client";

import { Card, CardBody, Image } from "@heroui/react";

export default function ArticleCard() {
  return (
    <Card className="shadow-none rounded-none">
      <CardBody className="overflow-visible p-0">
        <Image alt="Card background" src="/significant.png" width="100%" />
      </CardBody>
    </Card>
  );
}
