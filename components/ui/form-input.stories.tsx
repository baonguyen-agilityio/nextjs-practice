import type { Meta, StoryObj } from "@storybook/react";
import { FormInput } from "./form-input";

const meta: Meta<typeof FormInput> = {
  title: "Components/FormInput",
  component: FormInput,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password"],
    },
    required: {
      control: "boolean",
    },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Text: Story = {
  args: {
    id: "text-input",
    name: "text-input",
    label: "Text Input",
    type: "text",
    value: "",
    required: false,
  },
};

export const Email: Story = {
  args: {
    id: "email-input",
    name: "email-input",
    label: "Email Address",
    type: "email",
    value: "",
    required: true,
  },
};

export const Password: Story = {
  args: {
    id: "password-input",
    name: "password-input",
    label: "Password",
    type: "password",
    value: "",
    required: true,
  },
};

export const WithValue: Story = {
  args: {
    id: "filled-input",
    name: "filled-input",
    label: "Filled Input",
    type: "text",
    value: "This is a pre-filled value",
    required: false,
  },
};
