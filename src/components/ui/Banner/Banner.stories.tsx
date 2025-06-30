import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "./index";

const meta: Meta<typeof Banner> = {
  title: "UI Components/Banner",
  component: Banner,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Articles",
    description:
      "There are many variations of passages of Lorem Ipsum available, have suffered alteration in some form.",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Significant reading has more info number",
  },
};
