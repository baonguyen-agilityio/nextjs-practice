import type { Meta, StoryObj } from "@storybook/react";
import SkeletonCard from "./index";

const meta: Meta<typeof SkeletonCard> = {
  title: "Components/SkeletonCard",
  component: SkeletonCard,
  parameters: {
    layout: "centered",
  },
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
