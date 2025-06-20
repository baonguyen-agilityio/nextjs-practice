import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./index";

const meta: Meta<typeof Card> = {
  title: "UI Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-gray-600">This is a basic card component with some example content.</p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    isPressable: true,
    isHoverable: true,
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
        <p className="text-gray-600">This card can be clicked and shows hover effects.</p>
      </div>
    ),
  },
};
