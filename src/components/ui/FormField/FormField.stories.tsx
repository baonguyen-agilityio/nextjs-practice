import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./index";

const meta: Meta<typeof FormField> = {
  title: "UI Components/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
  },
};

export const Required: Story = {
  args: {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    errorMessage: "Password must be at least 8 characters long",
  },
};

export const WithHelpText: Story = {
  args: {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    helpText: "We'll use this to send you important updates",
  },
};
