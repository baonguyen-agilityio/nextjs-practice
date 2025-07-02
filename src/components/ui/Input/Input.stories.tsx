import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./index";

const meta: Meta<typeof Input> = {
  title: "UI Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Search books...",
    type: "text",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    isRequired: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    isInvalid: true,
    errorMessage: "Username already exists",
  },
};

export const ErrorWithDefaultBackground: Story = {
  args: {
    label: "Email Address",
    type: "email",
    placeholder: "name@example.com",
    isInvalid: true,
    errorMessage: "Please enter a valid email address",
    description: "Error styling with default background and label - only error text is red",
  },
};

export const Disabled: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    isDisabled: true,
  },
};

export const Clearable: Story = {
  args: {
    placeholder: "Search books...",
    size: "lg",
    isClearable: true,
  },
};
