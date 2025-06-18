"use client";

import type { Article } from "@/types";
import { formatDate } from "@/utils/date";
import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import Link from "next/link";
import { createImageUrl } from "@/utils/image";

export function ArticleCard(props: { article: Article }) {
  const { article } = props;

  return (
    <Card className="shadow-none rounded-none ">
      <CardBody className="overflow-visible p-0">
        <Image alt="Card background" src={createImageUrl(article.imageUrl)} width="100%" />
      </CardBody>
      <CardFooter className="flex flex-col gap-5 text-left items-start p-5">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-xl font-bold">{article.title}</p>
        </div>
        <p className="text-description font-inter text-xs">{article.content}</p>
        <div className="flex justify-between items-center w-full">
          <Link
            href={`/articles/${article.documentId}`}
            className="border-b-2 border-primary text-primary hover:opacity-50 transition-opacity duration-300"
          >
            Read more
          </Link>
          <div className="flex items-center gap-1 font-inter text-primary">
            <p className="text-xs">{article?.author?.name}</p>
            <span>-</span>
            <p className="text-xs">{formatDate(article?.publishedAt)}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
