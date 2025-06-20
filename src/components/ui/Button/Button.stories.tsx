import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "UI Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    onPress: fn(),
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Button",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary Button",
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    color: "secondary",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    isLoading: true,
    color: "primary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    isDisabled: true,
    color: "primary",
  },
};
