"use client";

import type { Article } from "@/types";
import { formatDate } from "@/utils/date";
import { createImageUrl, ImageQuality } from "@/utils/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";

export function ArticleCard(props: { article: Article }) {
  const { article } = props;
  const router = useRouter();

  const handleNavigateToDetails = () => {
    router.push(`/articles/${article.documentId}`);
  };

  return (
    <Card className="shadow-lg rounded-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <CardBody className="overflow-hidden p-0">
        <div
          className="w-full relative overflow-hidden cursor-pointer rounded-t-lg group"
          onClick={handleNavigateToDetails}
        >
          <div className="w-full h-[230px] relative overflow-hidden">
            <ImageWithFallback
              data-testid="hero-image"
              alt={`Cover image of ${article.title} article`}
              src={createImageUrl(article.imageUrl)}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              responsive="cardGrid"
              quality={ImageQuality.STANDARD}
              fallbackText="Article Cover"
              priority={false}
              placeholder="blur"
            />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col gap-5 text-left items-start p-5">
        <div className="flex justify-between items-center w-full" onClick={handleNavigateToDetails}>
          <p className="text-title text-xl font-bold hover:text-secondary transition-colors duration-300 cursor-pointer">
            {article.title}
          </p>
        </div>
        <p className="text-description font-inter text-xs">{article.content}</p>
        <div className="flex justify-between items-center w-full">
          <Button
            variant="text"
            size="lg"
            className="font-cardo font-bold text-primary underline underline-offset-4 decoration-[1.5px] decoration-primary min-w-fit p-0"
            onClick={handleNavigateToDetails}
            aria-label={`Read more about ${article.title}`}
          >
            <p className="text-md">Readmore</p>
          </Button>
          <div className="flex items-center gap-1 font-inter text-primary text-sm">
            <p>{formatDate(article?.publishedAt)}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
