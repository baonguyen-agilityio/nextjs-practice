import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { Book, Category } from "@/types";
import type { ActionResult } from "@/app/actions/book";
import { Card, CardFooter } from "@heroui/react";
import { formatUSD } from "@/utils/currency";
import Image from "next/image";
import { createImageUrl } from "@/utils/image";
import { Button } from "@/components/ui/Button";

function StorybookBookCard(props: {
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
    categories: _categories,
    formAction: _formAction,
    isPendingUpdateBook,
    result: _result,
    formActionDelete: _formActionDelete,
    isPendingDelete,
  } = props;

  const [imageSrc, setImageSrc] = useState(createImageUrl(book.imageUrl));

  const MockAddToCart = ({ book: mockBook, variant }: { book: Book; variant: "order" | "add" }) => {
    const handleClick = () => {
      console.log(`Adding book "${mockBook.title}" to cart with variant: ${variant}`);
    };

    if (variant === "order") {
      return (
        <Button
          aria-label="Order Today"
          color="primary"
          onPress={handleClick}
          variant="ghost"
          className="w-full"
        >
          Order Today
        </Button>
      );
    }

    return (
      <Button aria-label="Add to cart" variant="solid" onPress={handleClick} className="w-full">
        Add To Cart
      </Button>
    );
  };

  const MockEditModal = () => {
    const handleClick = () => {
      console.log(`Editing book: ${book.title}`);
    };

    return (
      <Button
        color="secondary"
        variant="bordered"
        onPress={handleClick}
        isLoading={isPendingUpdateBook}
        className="w-full"
      >
        Edit Book
      </Button>
    );
  };

  const MockDeleteModal = () => {
    const handleClick = () => {
      console.log(`Deleting book: ${book.title}`);
    };

    return (
      <Button
        color="primary"
        variant="bordered"
        onPress={handleClick}
        isLoading={isPendingDelete}
        className="w-full"
      >
        Delete Book
      </Button>
    );
  };

  return (
    <Card className="shadow-none rounded-none h-full flex flex-col">
      <div className="p-0">
        <div className="w-full h-[650px] relative overflow-hidden bg-background p-6">
          <div className="w-full h-full relative">
            <Image
              data-testid="book-image"
              alt={book.title}
              src={imageSrc}
              className="object-contain"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => {
                setImageSrc("/image-error.png");
              }}
            />
          </div>
        </div>
      </div>

      <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0 flex-grow">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-5xl">{book.title}</p>
          <p className="text-accent font-inter text-lg font-bold">{formatUSD(book.price)}</p>
        </div>
        <p className="text-description font-inter text-xs">{book.description}</p>

        <div className="space-y-2 w-full mt-auto">
          {isAdmin ? (
            <>
              <MockEditModal />
              <MockDeleteModal />
            </>
          ) : (
            <MockAddToCart book={book} variant="order" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

const mockBook: Book = {
  id: "1",
  title: "The Great Gatsby",
  price: 1499,
  imageUrl:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center",
  description:
    "A classic American novel by F. Scott Fitzgerald about the decadent society of the 1920s.",
  slug: "the-great-gatsby",
  language: "en",
  categories: [
    {
      id: 1,
      name: "Fiction",
      documentId: "fiction-doc-1",
    },
    {
      id: 2,
      name: "Classic Literature",
      documentId: "classic-doc-1",
    },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  publishedAt: "2024-01-01T00:00:00.000Z",
  documentId: "book-doc-1",
};

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Fiction",
    documentId: "fiction-doc-1",
  },
  {
    id: 2,
    name: "Classic Literature",
    documentId: "classic-doc-1",
  },
  {
    id: 3,
    name: "Science Fiction",
    documentId: "scifi-doc-1",
  },
];

const mockFormAction = () => {
  console.log("Form action triggered");
};

const mockFormActionDelete = () => {
  console.log("Delete action triggered");
};

const meta: Meta<typeof StorybookBookCard> = {
  title: "Feature Components/Book/BookCard",
  component: StorybookBookCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    book: mockBook,
    isAdmin: false,
    categories: mockCategories,
    formAction: mockFormAction,
    isPendingUpdateBook: false,
    result: undefined,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  },
};

export const AdminView: Story = {
  args: {
    book: mockBook,
    isAdmin: true,
    categories: mockCategories,
    formAction: mockFormAction,
    isPendingUpdateBook: false,
    result: undefined,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  },
};

export const WithoutImage: Story = {
  args: {
    book: {
      ...mockBook,
      imageUrl: "",
    },
    isAdmin: false,
    categories: mockCategories,
    formAction: mockFormAction,
    isPendingUpdateBook: false,
    result: undefined,
    formActionDelete: mockFormActionDelete,
    isPendingDelete: false,
  },
};
