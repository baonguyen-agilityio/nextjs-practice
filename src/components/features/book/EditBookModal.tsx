import { Button } from "@/components/ui/Button";
import { useDisclosure } from "@heroui/react";
import type { Book, Category } from "@/types";
import EditBookForm from "./EditBookForm";
import type { ActionResult } from "@/app/actions/book";
import { Modal } from "@/components/ui/Modal";

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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button
        size="lg"
        color="primary"
        variant="ghost"
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
        placement="top-center"
        title="Edit book"
        description="Edit the book details"
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
