import type { Meta, StoryObj } from "@storybook/react";
import SkeletonList from "./index";

const meta: Meta<typeof SkeletonList> = {
  title: "UI Components/SkeletonList",
  component: SkeletonList,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    length: 6,
  },
};

export const LargeList: Story = {
  args: {
    length: 12,
  },
};
