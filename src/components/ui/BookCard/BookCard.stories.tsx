import type { Meta, StoryObj } from "@storybook/react";
import BookCard from "@/components/ui/BookCard";

const meta: Meta<typeof BookCard> = {
  title: "Components/BookCard",
  component: BookCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BookCard>;

export const Default: Story = {
  args: {
    book: {
      id: "1",
      title: "Atomic One's",
      price: 29.99,
      description:
        "Many variations of passages of Lorem Ipsum willing araise alteration in some form.",
      imageUrl:
        "https://product.hstatic.net/200000896417/product/0e0f441f441a4e6fbafc3266f2704a6f_bb29c68e10ec4b54ad1cf502e0aec068_master.jpeg",
      slug: "atomic-ones",
      language: "en",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      documentId: "1",
    },
  },
};
