import React from "react";
import { FormField, type FormFieldProps } from "@/components/ui/FormField";
import type { FieldConfig } from "@/hooks/useFormValidation";

interface ValidatedFormFieldProps
  extends Omit<
    FormFieldProps,
    "onChange" | "value" | "errorMessage" | "name" | "label" | "type" | "required" | "id"
  > {
  field: FieldConfig;
  value: string;
  onChange: (name: string, value: string) => void;
  errorMessage?: string;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ValidatedFormField = React.forwardRef<
  React.ComponentRef<typeof FormField>,
  ValidatedFormFieldProps
>(({ field, value, onChange, errorMessage, isDisabled, size = "lg", ...formFieldProps }, ref) => {
  return (
    <FormField
      ref={ref}
      id={field.name}
      name={field.name}
      label={field.label}
      type={field.type}
      required={field.required}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value)}
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      size={size}
      {...formFieldProps}
    />
  );
});

ValidatedFormField.displayName = "ValidatedFormField";

export type { ValidatedFormFieldProps };
