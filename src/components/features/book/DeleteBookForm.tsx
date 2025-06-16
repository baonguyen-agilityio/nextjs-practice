"use client";

import { deleteBookAction } from "@/app/actions/book";
import { Button } from "@/components/ui/Button";
import type { Book } from "@/types";
import { useActionState } from "react";

export default function DeleteBookForm({ book, onClose }: { book: Book; onClose: () => void }) {
  const [errorMessage, formAction, isPending] = useActionState(deleteBookAction, undefined);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={book.documentId} />
      <p>Are you sure you want to delete this book?</p>
      {typeof errorMessage === "string" && <p className="text-danger">{errorMessage}</p>}
      <div className="flex justify-end gap-4 mt-4">
        <Button color="danger" variant="flat" onPress={onClose} type="button">
          Cancel
        </Button>
        <Button color="danger" variant="flat" type="submit" isLoading={isPending}>
          Delete
        </Button>
      </div>
    </form>
  );
}
