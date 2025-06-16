"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Book, Category } from "@/types";
import { Form } from "@heroui/react";
import { startTransition, useRef, useState } from "react";
import ImagePicker from "./ImagePicker";
import { Select, SelectItem } from "@heroui/react";
import type { ActionResult } from "@/app/actions/book";

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "price", label: "Price", type: "number", required: true },
  { name: "language", label: "Language", type: "text", required: false },
  { name: "description", label: "Description", type: "text", required: true },
];

export default function EditBookForm({
  book,
  onClose,
  categories,
  formAction,
  isPending,
  result,
}: {
  book: Book;
  onClose: () => void;
  categories: Category[];
  formAction: (payload: FormData) => void;
  isPending: boolean;
  result: ActionResult | undefined;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const fieldErrors =
    typeof result === "object" && result?.success === false && typeof result.error === "object"
      ? result.error
      : {};

  const generalError =
    typeof result === "object" && result?.success === false && typeof result.error === "string"
      ? result.error
      : null;

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" ref={formRef}>
      <input type="hidden" name="documentId" value={book.documentId} />
      {fields.map((field) => (
        <div key={field.name} className="w-full">
          <Input
            id={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            isRequired={field.required}
            defaultValue={String(book[field.name as keyof Book] || "")}
            isDisabled={isPending}
            size="lg"
            errorMessage={fieldErrors?.[field.name]?.[0]}
          />
        </div>
      ))}

      <div className="w-full">
        <Select
          name="categories"
          label="Category"
          placeholder="Select a category"
          isRequired
          isDisabled={isPending}
          size="lg"
          defaultSelectedKeys={[book.categories[0]?.documentId || ""]}
        >
          {categories.map((category) => (
            <SelectItem aria-label={category.name} key={category.documentId}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        {fieldErrors?.["categories"]?.[0] && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors["categories"][0]}</p>
        )}
      </div>

      <ImagePicker imageUrl={book.imageUrl} onFileChange={setSelectedFile} />
      {fieldErrors?.["image"]?.[0] && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors["image"][0]}</p>
      )}

      {generalError && <p className="text-red-500 text-sm">{generalError}</p>}

      <div className="flex justify-end gap-4 mt-4 w-full">
        <Button color="danger" variant="flat" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="flat" type="submit" isLoading={isPending}>
          Update
        </Button>
      </div>
    </Form>
  );
}
