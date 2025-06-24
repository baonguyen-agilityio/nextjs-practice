import { useState, useCallback } from "react";
import type { z } from "zod";

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface UseFormValidationProps<T extends z.ZodObject<any>> {
  schema: T;
  fields: FieldConfig[];
  initialValues?: Record<string, string>;
}

export function useFormValidation<T extends z.ZodObject<any>>({
  schema,
  fields,
  initialValues = {},
}: UseFormValidationProps<T>) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = initialValues[field.name] || "";
    });
    return initial;
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = useCallback(
    (name: string, value: string) => {
      try {
        const processedValue: string | number = value;

        const fieldData = { [name]: processedValue };
        const fieldSchema = schema.pick({ [name]: true } as any);
        fieldSchema.parse(fieldData);

        setValidationErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      } catch (error: any) {
        if (error?.issues && Array.isArray(error.issues)) {
          const fieldError = error.issues[0]?.message || `${name} is invalid`;
          setValidationErrors((prev) => ({
            ...prev,
            [name]: fieldError,
          }));
        } else {
          const fieldConfig = fields.find((f) => f.name === name);
          if (fieldConfig?.required && !value.trim()) {
            setValidationErrors((prev) => ({
              ...prev,
              [name]: `${fieldConfig.label} is required`,
            }));
          }
        }
      }
    },
    [schema, fields]
  );

  const handleFieldChange = useCallback(
    (name: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      const field = fields.find((f) => f.name === name);
      if (value.trim() || field?.required) {
        validateField(name, value);
      } else {
        setValidationErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [validateField, fields]
  );

  const resetForm = useCallback(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = initialValues[field.name] || "";
    });
    setFormData(initial);
    setValidationErrors({});
  }, [fields, initialValues]);

  const combineErrors = useCallback(
    (serverErrors: Record<string, any> = {}) => {
      const combinedErrors = { ...validationErrors };
      Object.keys(serverErrors).forEach((key) => {
        const serverError = serverErrors[key];
        if (serverError) {
          combinedErrors[key] = Array.isArray(serverError)
            ? serverError[0] || ""
            : String(serverError);
        }
      });
      return combinedErrors;
    },
    [validationErrors]
  );

  return {
    formData,
    validationErrors,
    handleFieldChange,
    validateField,
    resetForm,
    combineErrors,
    setFormData,
    setValidationErrors,
  };
}
