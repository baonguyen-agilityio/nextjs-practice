import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "./index";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
  parameters: {
    layout: "fullscreen",
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
