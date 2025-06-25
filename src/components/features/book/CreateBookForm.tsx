"use client";

import { createBook } from "@/app/actions/book";
import { Button } from "@/components/ui/Button";
import { addToast, Form } from "@heroui/react";
import { startTransition, useActionState, useEffect, useRef, useMemo } from "react";
import { useState } from "react";
import type { Category } from "@/types";
import { createBookSchema } from "@/schemas/book.schema";
import { useFormValidation } from "@/hooks/useFormValidation";
import { BookFormFields, bookFields } from "./BookFormFields";

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
  const handledRef = useRef(false);

  const { formData, handleFieldChange, combineErrors, resetForm } = useFormValidation({
    schema: createBookSchema,
    fields: [
      ...bookFields,
      { name: "categories", label: "Category", type: "select", required: true },
    ],
  });

  const handleCategoryChange = (value: string) => {
    handleFieldChange("categories", value);
  };

  const hasEmptyRequiredFields = useMemo(() => {
    const requiredFields = [
      ...bookFields.filter((field) => field.required),
      { name: "categories", label: "Category", type: "select", required: true },
    ];

    return (
      requiredFields.some((field) => {
        const value = formData[field.name];
        return !value || value.toString().trim() === "";
      }) || !selectedFile
    );
  }, [formData, selectedFile]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    handledRef.current = false;

    startTransition(() => {
      formAction(formData);
    });
  };

  const serverFieldErrors =
    typeof result === "object" && result?.success === false && typeof result.error === "object"
      ? result.error
      : {};

  const combinedErrors = combineErrors(serverFieldErrors);

  const isFormInvalid =
    isPending || Object.keys(combinedErrors).length > 0 || hasEmptyRequiredFields;

  useEffect(() => {
    if (!result || handledRef.current) return;
    if (result?.success) {
      addToast({
        title: result.message,
        color: "success",
      });
      resetForm();
      setSelectedFile(null);
      onClose();
    }
    if (result?.success === false) {
      addToast({
        title: "Failed to create book",
        color: "danger",
      });
    }
    handledRef.current = true;
  }, [result, onClose, resetForm]);

  return (
    <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" ref={formRef}>
      <BookFormFields
        fields={bookFields}
        formData={formData}
        validationErrors={combinedErrors}
        onFieldChange={handleFieldChange}
        onCategoryChange={handleCategoryChange}
        onFileChange={setSelectedFile}
        categories={categories}
        isDisabled={isPending}
        imageUrl=""
      />

      <div className="flex justify-end gap-4 mt-4 w-full">
        <div className="flex gap-2">
          <Button variant="secondaryGhost" onPress={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            type="submit"
            isLoading={isPending}
            isDisabled={isFormInvalid}
          >
            Create
          </Button>
        </div>
      </div>
    </Form>
  );
}
