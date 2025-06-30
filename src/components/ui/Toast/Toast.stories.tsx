import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { addToast } from "@heroui/react";

const meta: Meta = {
  title: "UI Components/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => (
    <Button
      onPress={() =>
        addToast({
          title: "Item added to cart successfully",
          color: "success",
        })
      }
    >
      Show Success Toast
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button
      onPress={() =>
        addToast({
          title: "Login failed",
          description: "Invalid email or password",
          color: "danger",
        })
      }
    >
      Show Error Toast
    </Button>
  ),
};

export const Simple: Story = {
  render: () => (
    <Button
      onPress={() =>
        addToast({
          title: "You must be logged in to add items to your cart",
          color: "danger",
        })
      }
    >
      Show Simple Error
    </Button>
  ),
};
