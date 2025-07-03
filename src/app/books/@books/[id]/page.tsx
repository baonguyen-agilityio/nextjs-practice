import { getBook } from "@/services/book";
import { BookDetails } from "@/components/features/book/BookDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatUSD } from "@/utils/currency";
import { auth } from "@/lib/auth/auth";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const { book } = await getBook({ id });

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found.",
    };
  }

  const price = formatUSD(book.price);

  return {
    title: book.title,
    description:
      book.description ||
      `${book.title} - Available for ${price} at BookStore. Order your copy today with fast shipping.`,
    keywords: [book.title, ...book.categories.map((cat) => cat.name), "books", "buy online"],
    openGraph: {
      title: `${book.title} | BookStore`,
      description:
        book.description ||
        `Get ${book.title} at BookStore for ${price}. Fast shipping and excellent customer service.`,
      type: "article",
    },

    alternates: {
      canonical: `/books/${id}`,
    },
  };
}

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const { book } = await getBook({ id });
  const session = await auth();

  if (!book) {
    return notFound();
  }

  return <BookDetails book={book} isAdmin={session?.user.role === "admin"} />;
}
