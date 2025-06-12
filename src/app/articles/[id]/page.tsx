import { getArticle } from "@/services/article";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ArticleDetails from "@/components/features/article/ArticleDetails";
import ArticleSkeleton from "@/components/features/article/ArticleSkeleton";

type Params = Promise<{ id: string }>;

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
