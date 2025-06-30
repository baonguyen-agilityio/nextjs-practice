import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import BookCard from "./BookCard";
import type { Book, Category } from "@/types";
import { HeroUIProvider } from "@heroui/react";

const meta: Meta<typeof BookCard> = {
  title: "Features/Book/BookCard",
  component: BookCard,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    docs: {
      story: {
        inline: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <HeroUIProvider>
        <div className="w-[350px]">
          <Story />
        </div>
      </HeroUIProvider>
    ),
  ],
  tags: ["autodocs"],
  args: {
    formAction: fn(),
    formActionDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleBook: Book = {
  id: "1",
  documentId: "book-1",
  slug: "atomic-ones",
  title: "Atomic One's",
  price: 24.99,
  language: "en",
  description: "A long established fact that a reader normal as well distribution of letters",
  imageUrl: "/book.png",
  categories: [
    { id: 1, documentId: "cat-1", name: "Fiction" },
    { id: 2, documentId: "cat-2", name: "Classic Literature" },
  ],
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  publishedAt: "2023-01-01T00:00:00.000Z",
};

const sampleCategories: Category[] = [
  { id: 1, documentId: "cat-1", name: "Fiction" },
  { id: 2, documentId: "cat-2", name: "Classic Literature" },
  { id: 3, documentId: "cat-3", name: "Mystery" },
  { id: 4, documentId: "cat-4", name: "Science Fiction" },
];

export const Default: Story = {
  args: {
    book: sampleBook,
    isAdmin: false,
    categories: sampleCategories,
    isPendingUpdateBook: false,
    result: undefined,
    isPendingDelete: false,
  },
};

export const AdminView: Story = {
  args: {
    book: sampleBook,
    isAdmin: true,
    categories: sampleCategories,
    isPendingUpdateBook: false,
    result: undefined,
    isPendingDelete: false,
  },
};
