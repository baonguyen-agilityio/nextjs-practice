import type { Meta, StoryObj } from "@storybook/react";
import SkeletonList from "./index";

const meta: Meta<typeof SkeletonList> = {
  title: "Components/SkeletonList",
  component: SkeletonList,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonList>;

export const Default: Story = {
  args: {
    length: 6,
  },
};
