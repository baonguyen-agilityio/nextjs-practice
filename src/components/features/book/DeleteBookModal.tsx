import type { Book } from "@/types";
import DeleteBookForm from "./DeleteBookForm";
import { Modal, useModal, ModalContent, ModalHeader, ModalBody } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export default function DeleteBookModal({
  book,
  formActionDelete,
  isPendingDelete,
}: {
  book: Book;
  formActionDelete: (payload: FormData) => void;
  isPendingDelete: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useModal();

  return (
    <>
      <Button variant="secondaryGhost" fullWidth onPress={onOpen}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
