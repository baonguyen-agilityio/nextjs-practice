import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./index";

const meta: Meta<typeof FormField> = {
  title: "UI/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Field name for form submission",
    },
    label: {
      control: "text",
      description: "Field label to display above the input",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
      description: "Input type",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display below the input",
    },
    helpText: {
      control: "text",
      description: "Help text to display below the input when no error is present",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
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
    required: true,
    errorMessage: "Password must be at least 8 characters long",
  },
};

export const WithArrayError: Story = {
  args: {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
    errorMessage: ["Username is required", "Username must be unique"],
  },
};

export const WithHelpText: Story = {
  args: {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
    helpText: "We'll use this to send you important updates",
  },
};

export const Disabled: Story = {
  args: {
    name: "readonly",
    label: "Read Only Field",
    value: "This field is disabled",
    isDisabled: true,
  },
};

export const RequiredWithoutIndicator: Story = {
  args: {
    name: "field",
    label: "Field Label",
    required: true,
    placeholder: "Required field without asterisk",
  },
};

export const LargeSize: Story = {
  args: {
    name: "description",
    label: "Description",
    placeholder: "Enter a description",
    size: "lg",
    helpText: "Provide a detailed description",
  },
};

export const NumberInput: Story = {
  args: {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
    min: 18,
    max: 100,
    helpText: "You must be at least 18 years old",
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-96">
      <FormField name="firstName" label="First Name" placeholder="Enter your first name" required />
      <FormField name="lastName" label="Last Name" placeholder="Enter your last name" required />
      <FormField
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        helpText="We'll never share your email with anyone"
      />
      <FormField
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        errorMessage="Password must be at least 8 characters"
      />
      <FormField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        required
      />
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example showing multiple FormField components in a typical form layout.",
      },
    },
  },
};
