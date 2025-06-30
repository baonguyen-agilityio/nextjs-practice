import { getArticle } from "@/services/article";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ArticleDetails from "@/components/features/article/ArticleDetails";
import ArticleSkeleton from "@/components/features/article/ArticleSkeleton";
import type { Metadata } from "next";
import { createImageUrl } from "@/utils/image";
import { formatDate } from "@/utils/date";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const { article } = await getArticle({ id });

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const imageUrl = createImageUrl(article.imageUrl);
  const publishDate = formatDate(article.publishedAt);

  return {
    title: article.title,
    description:
      article.description ||
      `${article.title} - Read our latest article about books, literature, and reading insights published on ${publishDate}.`,
    keywords: [article.title, "article", "blog", "books", "literature", "reading", "BookStore"],
    authors: [{ name: article.author?.name || "BookStore Team" }],
    openGraph: {
      title: `${article.title} | BookStore Articles`,
      description:
        article.description ||
        `Read "${article.title}" - our latest insights about books and literature.`,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Article image for ${article.title}`,
          type: "image/jpeg",
        },
      ],
      authors: [article.author?.name || "BookStore Team"],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: "Literature & Books",
      tags: ["books", "literature", "reading"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | BookStore Articles`,
      description: `Read "${article.title}" - insights about books and literature from BookStore.`,
      images: [
        {
          url: imageUrl,
          alt: `Article image for ${article.title}`,
        },
      ],
    },
    alternates: {
      canonical: `/articles/${id}`,
    },
  };
}

export default function ArticleDetailWrapper({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleDetail params={params} />
    </Suspense>
  );
}

async function ArticleDetail({ params }: { params: Params }) {
  const { id } = await params;
  const { article } = await getArticle({ id });

  if (!article) {
    return notFound();
  }

  return <ArticleDetails article={article} />;
}
