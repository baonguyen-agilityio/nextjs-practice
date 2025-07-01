import { Banner } from "@/components/ui/Banner";
import BackButton from "@/components/ui/BackButton";
import { createImageUrl } from "@/utils/image";
import { formatDate } from "@/utils/date";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { Article } from "@/types";

export function ArticleDetails({ article }: { article: Article }) {
  return (
    <>
      <Banner title="Significant reading has more info number" />
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="py-10 md:p-16 lg:p-20">
          <div className="flex justify-between mb-10">
            <BackButton />
          </div>

          <div className="relative w-full aspect-[16/9]">
            <ImageWithFallback
              src={createImageUrl(article.imageUrl)}
              alt={`Cover image of ${article.title} article`}
              width={1200}
              height={800}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              fallbackText="Article Image"
            />
          </div>

          <article className="space-y-4">
            <header>
              <h2 className="text-4xl font-bold text-primary">{article.title}</h2>
              <p className="text-lg font-semibold text-primary">
                {formatDate(article.publishedAt)} / {article.author?.name}
              </p>
            </header>

            <div className="prose max-w-none mt-6">
              <p className="text-primary font-inter text-sm leading-relaxed">{article.content}</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
