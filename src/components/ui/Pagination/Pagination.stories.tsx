import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
  title: "UI Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    total: 10,
    initialPage: 1,
    onChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const CurrentPage: Story = {
  args: {
    total: 15,
    initialPage: 5,
    onChange: (page: number) => console.log("Page changed to:", page),
  },
};
