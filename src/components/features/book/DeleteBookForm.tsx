"use client";

import { Button } from "@/components/ui/Button";
import type { Book } from "@/types";

export default function DeleteBookForm({
  book,
  onClose,
  formActionDelete,
  isPendingDelete,
}: {
  book: Book;
  onClose: () => void;
  formActionDelete: (payload: FormData) => void;
  isPendingDelete: boolean;
}) {
  return (
    <form action={formActionDelete}>
      <input type="hidden" name="id" value={book.documentId} />
      <p>Are you sure you want to delete this book?</p>
      <div className="flex justify-end gap-4 mt-4">
        <Button color="danger" variant="flat" onPress={onClose} type="button">
          Cancel
        </Button>
        <Button color="danger" variant="flat" type="submit" isLoading={isPendingDelete}>
          Delete
        </Button>
      </div>
    </form>
  );
}
