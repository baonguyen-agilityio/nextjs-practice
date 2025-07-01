import { getBook } from "@/services/book";
import { BookDetails } from "@/components/features/book/BookDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createImageUrl } from "@/utils/image";
import { formatUSD } from "@/utils/currency";

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

  const imageUrl = createImageUrl(book.imageUrl);
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
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `Cover of ${book.title}`,
          type: "image/jpeg",
        },
      ],
      authors: [`BookStore`],
      publishedTime: book.publishedAt,
      modifiedTime: book.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} | BookStore`,
      description: `Get ${book.title} for ${price} at BookStore. Order now!`,
      images: [
        {
          url: imageUrl,
          alt: `Cover of ${book.title}`,
        },
      ],
    },
    alternates: {
      canonical: `/books/${id}`,
    },
  };
}

export default async function BookDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const { book } = await getBook({ id });

  if (!book) {
    return notFound();
  }

  return <BookDetails book={book} />;
}
