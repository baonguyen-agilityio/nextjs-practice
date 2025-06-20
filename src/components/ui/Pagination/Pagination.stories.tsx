import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
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
