import { Button } from "@/components/ui/Button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import type { Book } from "@/types";
import EditBookForm from "./EditBookForm";

export default function EditBookModal({ book }: { book: Book }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button size="lg" color="primary" variant="ghost" fullWidth onPress={onOpen}>
        Edit
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit book</ModalHeader>
              <ModalBody>
                <EditBookForm book={book} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
