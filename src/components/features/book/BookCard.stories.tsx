import type { Meta, StoryObj } from "@storybook/react";
import BookCard from "./BookCard";
import type { Book, Category } from "@/types";

// Mock data for the book
const mockBook: Book = {
  id: "1",
  title: "The Great Gatsby",
  price: 14.99,
  imageUrl: "/test-book-cover.jpg",
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

// Mock the AddToCart component to avoid complex dependencies
jest.mock("@/components/features/cart/AddToCart", () => ({
  AddToCart: ({ book: _book, variant }: { book: Book; variant: string }) => (
    <button className="w-full bg-blue-500 text-white p-2 rounded">
      {variant === "order" ? "Add to Cart" : "Quick Add"}
    </button>
  ),
}));

// Mock the modal components
jest.mock("./EditBookModal", () => ({
  __esModule: true,
  default: ({ book: _book }: { book: Book }) => (
    <button className="w-full bg-yellow-500 text-white p-2 rounded">Edit {_book.title}</button>
  ),
}));

jest.mock("./DeleteBookModal", () => ({
  __esModule: true,
  default: ({ book: _book }: { book: Book }) => (
    <button className="w-full bg-red-500 text-white p-2 rounded">Delete {_book.title}</button>
  ),
}));

// Mock the currency utility
jest.mock("@/utils/currency", () => ({
  formatUSD: (price: number) => `$${price.toFixed(2)}`,
}));

const meta: Meta<typeof BookCard> = {
  title: "Features/BookCard",
  component: BookCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#000000" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isAdmin: {
      control: { type: "boolean" },
      description: "Whether the user is an admin (shows edit/delete buttons)",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "300px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BookCard>;

export const Default: Story = {
  args: {
    book: mockBook,
    isAdmin: false,
    categories: mockCategories,
  },
};

export const AdminView: Story = {
  args: {
    book: mockBook,
    isAdmin: true,
    categories: mockCategories,
  },
};

export const LongTitle: Story = {
  args: {
    book: {
      ...mockBook,
      title: "The Extremely Long and Detailed Title of a Book That Goes On and On",
    },
    isAdmin: false,
    categories: mockCategories,
  },
};

export const LongDescription: Story = {
  args: {
    book: {
      ...mockBook,
      description:
        "This is a very long description that goes on and on to demonstrate how the card handles lengthy text content. It should wrap properly and maintain good visual hierarchy while not breaking the card layout. This description continues to be quite lengthy to test the boundaries of the design.",
    },
    isAdmin: false,
    categories: mockCategories,
  },
};

export const HighPrice: Story = {
  args: {
    book: {
      ...mockBook,
      title: "Premium Technical Manual",
      price: 299.99,
      description: "An expensive technical manual for professionals.",
    },
    isAdmin: false,
    categories: mockCategories,
  },
};

export const LowPrice: Story = {
  args: {
    book: {
      ...mockBook,
      title: "Budget Paperback",
      price: 2.99,
      description: "An affordable paperback edition.",
    },
    isAdmin: false,
    categories: mockCategories,
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
  },
};
