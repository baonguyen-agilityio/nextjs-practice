import React from "react";
import { ValidatedFormField } from "@/components/ui/ValidatedFormField";
import { ValidatedSelectField } from "@/components/ui/ValidatedSelectField";
import ImagePicker from "./ImagePicker";
import type { Category } from "@/types";
import type { FieldConfig } from "@/hooks/useFormValidation";

export const bookFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "price", label: "Price", type: "number", required: true },
  { name: "language", label: "Language", type: "text", required: false },
  { name: "description", label: "Description", type: "text", required: true },
];

interface BookFormFieldsProps {
  fields: FieldConfig[];
  formData: Record<string, string>;
  validationErrors: Record<string, string>;
  onFieldChange: (name: string, value: string) => void;
  onCategoryChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  categories: Category[];
  isDisabled?: boolean;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

export const BookFormFields: React.FC<BookFormFieldsProps> = ({
  fields,
  formData,
  validationErrors,
  onFieldChange,
  onCategoryChange,
  onFileChange,
  categories,
  isDisabled = false,
  imageUrl = "",
  size = "lg",
}) => {
  const categoryOptions = categories.map((category) => ({
    key: category.documentId,
    label: category.name,
    value: category.documentId,
  }));

  return (
    <>
      {fields.map((field) => (
        <ValidatedFormField
          key={field.name}
          field={field}
          value={formData[field.name] || ""}
          onChange={onFieldChange}
          errorMessage={validationErrors[field.name]}
          isDisabled={isDisabled}
          size={size}
        />
      ))}

      <ValidatedSelectField
        name="categories"
        label="Category"
        required
        value={formData.categories || ""}
        onChange={onCategoryChange}
        options={categoryOptions}
        errorMessage={validationErrors.categories}
        isDisabled={isDisabled}
        size={size}
      />

      <ImagePicker imageUrl={imageUrl} onFileChange={onFileChange} />
      {validationErrors.image && (
        <p className="text-red-500 text-sm mt-1">{validationErrors.image}</p>
      )}
    </>
  );
};
