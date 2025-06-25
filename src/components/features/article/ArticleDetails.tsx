"use client";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/types";
import Image from "next/image";
import { createImageUrl } from "@/utils/image";
import { formatDate } from "@/utils/date";

export default function ArticleDetails({ article }: { article: Article }) {
  return (
    <>
      <Banner title="Significant reading has more info number" />
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="py-10 md:p-16 lg:p-20">
          <div className="flex justify-between mb-10">
            <Button variant="secondaryGhost" onClick={() => window.history.back()}>
              ← Back to list
            </Button>
          </div>
          <div className="relative w-full aspect-[3/2]">
            <Image
              src={createImageUrl(article.imageUrl)}
              alt={`article`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
          <div className="space-y-4 mt-5">
            <p className="text-lg font-semibold text-primary">
              {formatDate(article.publishedAt)} / {article.author?.name}
            </p>
            <p className="text-primary font-inter text-sm">{article.content}</p>
          </div>
        </div>
      </section>
    </>
  );
}
