import type { Meta, StoryObj } from "@storybook/react";
import SkeletonCard from "./index";

const meta: Meta<typeof SkeletonCard> = {
  title: "Components/SkeletonCard",
  component: SkeletonCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SkeletonCard>;

export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <SkeletonCard />
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-6 w-[600px]">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "responsive",
    },
  },
};
