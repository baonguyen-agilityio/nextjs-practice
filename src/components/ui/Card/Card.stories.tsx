import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./index";
import { CardBody, CardFooter, CardHeader } from "@heroui/react";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">NextUI</p>
          <p className="text-small text-default-500">nextui.org</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">NextUI</p>
          <p className="text-small text-default-500">nextui.org</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <CardFooter>
        <p className="text-small text-default-500">Footer content</p>
      </CardFooter>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card className="max-w-[400px]" isPressable>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Pressable Card</p>
          <p className="text-small text-default-500">Click me!</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>This card responds to interactions.</p>
      </CardBody>
    </Card>
  ),
};
