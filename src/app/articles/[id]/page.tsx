import { getArticle } from "@/services/article";
import { ArticleDetails } from "@/components/features/article/ArticleDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  const publishedDate = formatDate(article.publishedAt);

  return {
    title: article.title,
    description:
      article.description ||
      `${article.title} - Published on ${publishedDate} by ${article.author?.name}. Read this insightful article at BookStore.`,
    keywords: [article.title, "article", "blog", "books", "literature", "reading", "BookStore"],
    authors: [{ name: article.author?.name || "BookStore Team" }],
    openGraph: {
      title: `${article.title} | BookStore Articles`,
      description:
        article.description ||
        `Read "${article.title}" by ${article.author?.name}. Published on ${publishedDate}.`,
      type: "article",
      section: "Literature & Books",
      tags: ["books", "literature", "reading", article.title],
    },
    alternates: {
      canonical: `/articles/${id}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const { article } = await getArticle({ id });

  if (!article) {
    return notFound();
  }

  return <ArticleDetails article={article} />;
}
