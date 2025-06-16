"use client";

import { createBook } from "@/app/actions/book";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Form } from "@heroui/react";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import ImagePicker from "./ImagePicker";
import { Select, SelectItem } from "@heroui/react";
import type { Category } from "@/types";

const fields = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "price", label: "Price", type: "number", required: true },
  { name: "language", label: "Language", type: "text", required: false },
  { name: "description", label: "Description", type: "text", required: true },
];

export default function CreateBookForm({
  onClose,
  categories,
}: {
  onClose: () => void;
  categories: Category[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, formAction, isPending] = useActionState(createBook, undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  useEffect(() => {
    if (result?.success) {
      onClose();
    }
  }, [result, onClose]);

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" ref={formRef}>
      {fields.map((field) => (
        <div key={field.name} className="w-full">
          <Input
            id={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            isRequired={field.required}
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

      <ImagePicker imageUrl="" onFileChange={setSelectedFile} />
      {fieldErrors?.["image"]?.[0] && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors["image"][0]}</p>
      )}

      {generalError && <p className="text-red-500 text-sm">{generalError}</p>}

      <div className="flex justify-end gap-4 mt-4 w-full">
        <Button color="danger" variant="flat" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="flat" type="submit" isLoading={isPending}>
          Create
        </Button>
      </div>
    </Form>
  );
}
