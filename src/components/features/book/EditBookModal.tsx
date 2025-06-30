import { Button } from "@/components/ui/Button";
import type { Book, Category } from "@/types";
import EditBookForm from "./EditBookForm";
import type { ActionResult } from "@/app/actions/book";
import { Modal, useModal } from "@/components/ui/Modal";

export default function EditBookModal({
  book,
  categories,
  formAction,
  isPending,
  result,
}: {
  book: Book;
  categories: Category[];
  formAction: (payload: FormData) => void;
  isPending: boolean;
  result: ActionResult | undefined;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useModal();

  return (
    <>
      <Button
        size="lg"
        variant="primaryGhost"
        fullWidth
        onPress={onOpen}
        data-testid="trigger-button"
      >
        Edit
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        title="Edit book"
        onClose={onClose}
        data-testid="modal"
      >
        <EditBookForm
          book={book}
          onClose={onClose}
          categories={categories}
          formAction={formAction}
          isPending={isPending}
          result={result}
        />
      </Modal>
    </>
  );
}
