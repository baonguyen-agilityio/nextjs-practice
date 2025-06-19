import type { Meta, StoryObj } from "@storybook/react";
import SkeletonList from "./index";

const meta: Meta<typeof SkeletonList> = {
  title: "Components/SkeletonList",
  component: SkeletonList,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    length: {
      control: { type: "number", min: 1, max: 20 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonList>;

export const Default: Story = {
  args: {
    length: 6,
  },
};

export const Small: Story = {
  args: {
    length: 3,
  },
};

export const Large: Story = {
  args: {
    length: 12,
  },
};

export const Single: Story = {
  args: {
    length: 1,
  },
};

export const Grid: Story = {
  args: {
    length: 9,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows how the skeleton list adapts to different grid layouts on various screen sizes.",
      },
    },
  },
};
