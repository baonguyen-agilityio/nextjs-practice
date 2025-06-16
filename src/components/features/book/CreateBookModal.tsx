import { Button } from "@/components/ui/Button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import CreateBookForm from "./CreateBookForm";
import type { Category } from "@/types";

export default function CreateBookModal({ categories }: { categories: Category[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button size="lg" color="primary" variant="ghost" onPress={onOpen}>
        Add New Book
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Book</ModalHeader>
              <ModalBody>
                <CreateBookForm onClose={onClose} categories={categories} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
