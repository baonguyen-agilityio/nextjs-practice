import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardBody, CardFooter } from "@heroui/react";

const meta: Meta<typeof Card> = {
  title: "UI Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardBody>
        <p>Simple card content</p>
      </CardBody>
    </Card>
  ),
};

export const WithShadow: Story = {
  render: () => (
    <Card className="shadow-lg rounded-lg border border-gray-100 w-[300px]">
      <CardBody className="overflow-hidden p-0">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <p>Image area</p>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col gap-5 text-left items-start p-5">
        <h3 className="text-xl font-bold">Card Title</h3>
        <p className="text-gray-600">Card description text</p>
      </CardFooter>
    </Card>
  ),
};

export const BookStyle: Story = {
  render: () => (
    <Card className="shadow-none rounded-none h-full flex flex-col w-[300px]">
      <div className="w-full h-[200px] relative overflow-hidden bg-gray-100 p-6">
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">Book Cover</div>
      </div>
      <CardFooter className="flex flex-col gap-5 text-left items-start py-5 px-0 flex-grow">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-2xl font-bold">Book Title</h3>
          <p className="text-lg font-bold text-orange-500">$19.99</p>
        </div>
        <p className="text-gray-600 text-sm">Book description goes here...</p>
      </CardFooter>
    </Card>
  ),
};

export const SkeletonStyle: Story = {
  render: () => (
    <Card className="space-y-5 p-4 w-[300px]" radius="lg" shadow="none">
      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    </Card>
  ),
};
