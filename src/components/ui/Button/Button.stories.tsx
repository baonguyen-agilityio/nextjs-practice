import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Bordered: Story = {
  args: {
    variant: "bordered",
    children: "Order Today",
  },
};

export const Solid: Story = {
  args: {
    variant: "solid",
    children: "Order Today",
  },
};

export const Light: Story = {
  args: {
    variant: "light",
    children: "Order Today",
  },
};
