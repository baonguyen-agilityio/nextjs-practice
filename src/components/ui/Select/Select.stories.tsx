import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectItem } from "./index";

const meta: Meta<typeof Select> = {
  title: "UI Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
];

export const Default: Story = {
  args: {
    children: options.map((option) => <SelectItem key={option.key}>{option.label}</SelectItem>),
  },
};

export const WithLabel: Story = {
  args: {
    label: "Favorite Animal",
    children: options.map((option) => <SelectItem key={option.key}>{option.label}</SelectItem>),
  },
};

export const WithError: Story = {
  args: {
    label: "Required Field",
    isInvalid: true,
    errorMessage: "This field is required",
    children: options.map((option) => <SelectItem key={option.key}>{option.label}</SelectItem>),
  },
};

export const ErrorWithDefaultBackground: Story = {
  args: {
    label: "Category",
    isInvalid: true,
    errorMessage: "Please choose a valid category",
    description: "Error styling with default background and label - only error text is red",
    children: options.map((option) => <SelectItem key={option.key}>{option.label}</SelectItem>),
  },
};
