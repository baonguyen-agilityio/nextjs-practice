"use client";

import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/types";
import Image from "next/image";
import { createImageUrl } from "@/utils/image";

export default function ArticleDetails({ article }: { article: Article }) {
  return (
    <>
      <Banner title="Significant reading has more info number" />
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between">
          <Button
            variant="light"
            onClick={() => window.history.back()}
            className="text-description"
          >
            ← Back to list
          </Button>
        </div>
        <div className="py-10 md:p-16 lg:p-20">
          <Image
            src={createImageUrl(article.imageUrl)}
            alt={`article`}
            layout="responsive"
            width={600}
            height={400}
            objectFit="contain"
          />
          <div className="space-y-4 mt-5">
            <p className="text-xl font-semibold text-primary">{article.publishedAt} / Author</p>
            <div
              dangerouslySetInnerHTML={{
                __html: article.content ?? "",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
