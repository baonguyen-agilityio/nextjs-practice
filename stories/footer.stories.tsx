import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@/components/layouts/Footer";

const meta: Meta<typeof Footer> = {
  title: "Layout Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
