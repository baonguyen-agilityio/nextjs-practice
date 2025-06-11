import { getBook } from "@/services";
import { BookDetails } from "@/components/features/book/BookDetails";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SkeletonList from "@/components/ui/SkeletonList";

type Params = Promise<{ id: string }>;

export default function BookDetailWrapper({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <>
          <SkeletonList length={6} />
        </>
      }
    >
      <BookDetail params={params} />
    </Suspense>
  );
}

async function BookDetail({ params }: { params: Params }) {
  const { id } = await params;
  const { book } = await getBook({ id });

  if (!book) {
    return notFound();
  }

  return <BookDetails book={book} />;
}
