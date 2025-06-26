"use client";

import { Button } from "@/components/ui/Button";
import type { Book, Category } from "@/types";
import { Form } from "@heroui/react";
import { startTransition, useRef, useState, useMemo } from "react";
import type { ActionResult } from "@/app/actions/book";
import { useFormValidation } from "@/hooks/useFormValidation";
import { updateBookSchema } from "@/schemas/book.schema";
import { BookFormFields, bookFields } from "./BookFormFields";

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

  const initialValues = {
    title: book.title || "",
    price: book.price?.toString() || "",
    language: book.language || "",
    description: book.description || "",
    categories: book.categories[0]?.documentId || "",
  };

  const { formData, handleFieldChange, combineErrors } = useFormValidation({
    schema: updateBookSchema,
    fields: [
      ...bookFields,
      { name: "categories", label: "Category", type: "select", required: true },
    ],
    initialValues,
  });

  const handleCategoryChange = (value: string) => {
    handleFieldChange("categories", value);
  };

  const hasEmptyRequiredFields = useMemo(() => {
    const requiredFields = [
      ...bookFields.filter((field) => field.required),
      { name: "categories", label: "Category", type: "select", required: true },
    ];

    return requiredFields.some((field) => {
      const value = formData[field.name];
      return !value || value.toString().trim() === "";
    });
  }, [formData]);

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

  const serverFieldErrors =
    typeof result === "object" && result?.success === false && typeof result.error === "object"
      ? result.error
      : {};

  const generalError =
    typeof result === "object" && result?.success === false && typeof result.error === "string"
      ? result.error
      : null;

  const combinedErrors = combineErrors(serverFieldErrors);

  const isFormInvalid =
    isPending || Object.keys(combinedErrors).length > 0 || hasEmptyRequiredFields;

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" ref={formRef}>
      <input type="hidden" name="documentId" value={book.documentId} />

      <BookFormFields
        fields={bookFields}
        formData={formData}
        validationErrors={combinedErrors}
        onFieldChange={handleFieldChange}
        onCategoryChange={handleCategoryChange}
        onFileChange={setSelectedFile}
        categories={categories}
        isDisabled={isPending}
        imageUrl={book.imageUrl}
      />

      {generalError && <p className="text-red-500 text-sm">{generalError}</p>}

      <div className="flex justify-end gap-4 mt-4 w-full">
        <Button variant="secondaryGhost" onPress={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" type="submit" isLoading={isPending} isDisabled={isFormInvalid}>
          Update
        </Button>
      </div>
    </Form>
  );
}
