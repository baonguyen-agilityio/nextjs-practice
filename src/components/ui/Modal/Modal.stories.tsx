import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./index";
import { Button } from "../Button";
import { Input } from "../Input";
import { useState } from "react";

const meta: Meta<typeof Modal> = {
  title: "UI Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultModalStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        footer={
          <div className="flex gap-2">
            <Button variant="secondaryGhost" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <p>This is the modal content. You can put any content here.</p>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <DefaultModalStory />,
};

const WithFormModalStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Add User</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New User"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="secondaryGhost" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Save User
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Enter full name" />
          <Input label="Email" type="email" placeholder="user@example.com" />
          <Input label="Role" placeholder="Select role" />
        </div>
      </Modal>
    </>
  );
};

export const WithForm: Story = {
  render: () => <WithFormModalStory />,
};

const ConfirmationModalStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        Delete Item
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="secondaryGhost" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Delete
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export const Confirmation: Story = {
  render: () => <ConfirmationModalStory />,
};

const NoTitleModalStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Modal (No Title)</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondaryGhost" onPress={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <p>This modal has no title, so no header background will be shown.</p>
      </Modal>
    </>
  );
};

export const NoTitle: Story = {
  render: () => <NoTitleModalStory />,
};
