import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

const ToastDemo = ({
  title,
  description,
  color = "default",
}: {
  title: string;
  description?: string;
  color?: "default" | "primary" | "success" | "warning" | "danger";
}) => (
  <div
    className={`
      p-4 rounded-lg border max-w-sm
      ${color === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
      ${color === "danger" ? "bg-red-50 border-red-200 text-red-800" : ""}
      ${color === "warning" ? "bg-yellow-50 border-yellow-200 text-yellow-800" : ""}
      ${color === "primary" ? "bg-blue-50 border-blue-200 text-blue-800" : ""}
      ${color === "default" ? "bg-gray-50 border-gray-200 text-gray-800" : ""}
    `}
  >
    <div className="font-semibold text-sm">{title}</div>
    {description && <div className="text-xs mt-1 opacity-80">{description}</div>}
  </div>
);

const meta: Meta<typeof ToastDemo> = {
  title: "UI Components/Toast",
  component: ToastDemo,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Notification",
    description: "This is a default toast message",
    color: "default",
  },
};

export const Success: Story = {
  args: {
    title: "Success!",
    description: "Operation completed",
    color: "success",
  },
};

export const Error: Story = {
  args: {
    title: "Error",
    description: "Something went wrong",
    color: "danger",
  },
};
