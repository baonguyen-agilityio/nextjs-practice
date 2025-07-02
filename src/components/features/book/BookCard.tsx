"use client";

import { formatUSD } from "@/utils/currency";
import type { Book, Category } from "@/types";
import { LazyEditBookModal, LazyDeleteBookModal } from "./DynamicModals";
import type { ActionResult } from "@/app/actions/book";
import { createImageUrl } from "@/utils/image";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Card, CardFooter } from "@/components/ui/Card";

export default function BookCard(props: {
  book: Book;
  isAdmin: boolean;
  categories: Category[];
  formAction: (payload: FormData) => void;
  isPendingUpdateBook: boolean;
  result: ActionResult | undefined;
  formActionDelete: (payload: FormData) => void;
  isPendingDelete: boolean;
}) {
  const {
    book,
    isAdmin,
    categories,
    formAction,
    isPendingUpdateBook,
    result,
    formActionDelete,
    isPendingDelete,
  } = props;

  const imageSrc = createImageUrl(book.imageUrl);
  const formattedPrice = formatUSD(book.price);
  const router = useRouter();

  const handleNavigateToDetails = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/books/${book.documentId}`);
  };

  return (
    <article
      className="shadow-none rounded-none h-full flex flex-col"
      aria-labelledby={`book-title-${book.documentId}`}
      aria-describedby={`book-description-${book.documentId} book-price-${book.documentId}`}
    >
      <Card className="shadow-none rounded-none h-full flex flex-col">
        <div className="p-0 cursor-pointer" onClick={handleNavigateToDetails}>
          <div className="w-full h-[550px] relative overflow-hidden bg-background p-10">
            <div className="w-full h-full relative">
              <ImageWithFallback
                data-testid="book-image"
                alt={`Cover image of ${book.title} book`}
                src={imageSrc}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                fallbackText="Book Cover"
              />
            </div>
          </div>
        </div>

        <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0 flex-grow">
          <header className="flex justify-between items-center w-full">
            <h3 id={`book-title-${book.documentId}`} className="text-title text-5xl">
              {book.title}
            </h3>
            <p
              id={`book-price-${book.documentId}`}
              className="text-accent font-inter text-lg font-bold"
              aria-label={`Price: ${formattedPrice}`}
            >
              {formattedPrice}
            </p>
          </header>

          <p
            id={`book-description-${book.documentId}`}
            className="text-description font-inter text-xs"
          >
            {book.description}
          </p>

          <div className="space-y-2 w-full mt-auto" role="group" aria-label="Book actions">
            {isAdmin ? (
              <>
                <LazyEditBookModal
                  book={book}
                  categories={categories}
                  formAction={formAction}
                  isPending={isPendingUpdateBook}
                  result={result}
                />
                <LazyDeleteBookModal
                  book={book}
                  formActionDelete={formActionDelete}
                  isPendingDelete={isPendingDelete}
                />
              </>
            ) : (
              <Button variant="secondaryGhost" size="lg" onClick={handleNavigateToDetails}>
                Order Today
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </article>
  );
}
