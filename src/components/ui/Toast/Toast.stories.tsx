import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./index";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600 mb-4">
        Note: Toast components are typically triggered by actions. Below are static examples.
      </p>
      <Toast>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span>This is a default toast message</span>
        </div>
      </Toast>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <Toast>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span>Success! Your action was completed.</span>
      </div>
    </Toast>
  ),
};

export const Error: Story = {
  render: () => (
    <Toast>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span>Error! Something went wrong.</span>
      </div>
    </Toast>
  ),
};

export const Warning: Story = {
  render: () => (
    <Toast>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        <span>Warning! Please check your input.</span>
      </div>
    </Toast>
  ),
};
