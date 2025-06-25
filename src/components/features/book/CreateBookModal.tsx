import { Button } from "@/components/ui/Button";
import { Modal, useModal } from "@/components/ui/Modal";
import CreateBookForm from "./CreateBookForm";
import type { Category } from "@/types";

export default function CreateBookModal({ categories }: { categories: Category[] }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useModal();

  return (
    <>
      <Button onPress={onOpen} variant="primary" aria-label="Add New Book">
        Add New Book
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Book"
        size="5xl"
        color="secondary"
        scrollBehavior="outside"
        description="Add a new book to the library"
      >
        <CreateBookForm categories={categories} onClose={onClose} />
      </Modal>
    </>
  );
}
