import type { Book } from "@/types";
import DeleteBookForm from "./DeleteBookForm";
import { Modal, useModal } from "@/components/ui/Modal";
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
  const { isOpen, onOpen, onOpenChange, onClose } = useModal();

  return (
    <>
      <Button variant="secondaryGhost" fullWidth onPress={onOpen}>
        Delete
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} title="Delete book">
        <DeleteBookForm
          book={book}
          onClose={onClose}
          formActionDelete={formActionDelete}
          isPendingDelete={isPendingDelete}
        />
      </Modal>
    </>
  );
}
