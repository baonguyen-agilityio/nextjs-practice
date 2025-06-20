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
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Full Name",
    placeholder: "Enter your full name",
  },
};

export const Required: Story = {
  args: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
    isRequired: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    isInvalid: true,
    errorMessage: "Username is already taken",
    value: "invalid-username",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    type: "password",
    description: "Password must be at least 8 characters long",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "This input is disabled",
    isDisabled: true,
  },
};
