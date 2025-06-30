import type { Meta, StoryObj } from "@storybook/react";
import SkeletonCard from "./index";

const meta: Meta<typeof SkeletonCard> = {
  title: "UI Components/SkeletonCard",
  component: SkeletonCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
