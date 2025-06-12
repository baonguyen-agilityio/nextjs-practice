import { updateBook } from "@/app/actions/book";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Book } from "@/types";
import { useActionState } from "react";

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "price", label: "Price", type: "number", required: true },
  { name: "language", label: "Language", type: "text", required: false },
  { name: "description", label: "Description", type: "text", required: true },
];

export default function EditBookForm({ book, onClose }: { book: Book; onClose: () => void }) {
  const [errorMessage, formAction, isPending] = useActionState(updateBook, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full">
      <input type="hidden" name="id" value={book.documentId} />
      <input type="hidden" name="imageUrl" value={book.imageUrl} />
      {fields.map((field) => (
        <Input
          key={field.name}
          id={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          required={field.required}
          defaultValue={String(book[field.name as keyof Book] || "")}
          isDisabled={isPending}
        />
      ))}
      {typeof errorMessage === "string" && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}

      <div className="flex justify-end gap-4">
        <Button color="danger" variant="flat" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="flat" type="submit">
          Update
        </Button>
      </div>
    </form>
  );
}
