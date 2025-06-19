import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    total: {
      control: { type: "number", min: 1, max: 50 },
    },
    initialPage: {
      control: { type: "number", min: 1 },
    },
    onChange: { action: "page changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    total: 10,
    initialPage: 1,
  },
};

export const ManyPages: Story = {
  args: {
    total: 25,
    initialPage: 5,
  },
};

export const FewPages: Story = {
  args: {
    total: 3,
    initialPage: 1,
  },
};

export const SinglePage: Story = {
  args: {
    total: 1,
    initialPage: 1,
  },
};

export const MiddlePage: Story = {
  args: {
    total: 20,
    initialPage: 10,
  },
};
