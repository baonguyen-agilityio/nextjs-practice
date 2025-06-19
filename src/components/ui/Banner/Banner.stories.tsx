import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "./index";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    title: "Welcome to Our Store",
    description: "Discover amazing books and start your reading journey today.",
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "Books Collection",
  },
};

export const LongTitle: Story = {
  args: {
    title: "Discover the World's Best Collection of Books",
    description:
      "From classic literature to modern bestsellers, find your next great read in our extensive collection.",
  },
};

export const Promotional: Story = {
  args: {
    title: "50% Off All Books",
    description:
      "Limited time offer! Get your favorite books at half the price. Free shipping on orders over $50.",
  },
};
