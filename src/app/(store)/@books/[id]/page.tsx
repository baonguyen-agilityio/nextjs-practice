import { getBook } from "@/services";
import { BookDetails } from "@/components/features/book/BookDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function BookDetail({ params }: { params: Params }) {
  const { id } = await params;
  const { book } = await getBook({ id });

  if (!book) {
    return notFound();
  }

  return <BookDetails book={book} />;
}
