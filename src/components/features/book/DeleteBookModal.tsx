import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import type { Book } from "@/types";
import DeleteBookForm from "./DeleteBookForm";

export default function DeleteBookModal({
  book,
  formActionDelete,
  isPendingDelete,
}: {
  book: Book;
  formActionDelete: (payload: FormData) => void;
  isPendingDelete: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button size="lg" color="danger" variant="ghost" fullWidth onPress={onOpen}>
        Delete
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete book</ModalHeader>
              <ModalBody>
                <DeleteBookForm
                  book={book}
                  onClose={onClose}
                  formActionDelete={formActionDelete}
                  isPendingDelete={isPendingDelete}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
