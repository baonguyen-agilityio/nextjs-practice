"use client";

import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { addToast } from "@heroui/react";
import { authenticate } from "@/app/actions";
import { ValidatedFormField } from "@/components/ui/ValidatedFormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { loginSchema } from "@/schemas/auth.schema";
import type { FieldConfig } from "@/hooks/useFormValidation";

export const loginFields: FieldConfig[] = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
];

export default function LoginForm() {
  const [_, formActionWithToast, isPending] = useActionState(
    async (prevState: string | undefined, formData: FormData) => {
      const result = await authenticate(prevState, formData);

      if (typeof result === "string") {
        addToast({
          title: "Login failed",
          description: result,
          color: "danger",
        });
      }

      return result;
    },
    undefined
  );

  const { formData, handleFieldChange, combineErrors, validationErrors } = useFormValidation({
    schema: loginSchema,
    fields: loginFields,
  });

  const hasEmptyRequiredFields = useMemo(() => {
    return loginFields
      .filter((field) => field.required)
      .some((field) => {
        const value = formData[field.name];
        return !value || value.toString().trim() === "";
      });
  }, [formData]);

  const combinedErrors = combineErrors();
  const isFormInvalid = useMemo(() => {
    return (
      isPending ||
      Object.keys(validationErrors).length > 0 ||
      Object.keys(combinedErrors).length > 0 ||
      hasEmptyRequiredFields
    );
  }, [isPending, validationErrors, combinedErrors, hasEmptyRequiredFields]);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <form action={formActionWithToast} className="space-y-6">
        {loginFields.map((field) => (
          <ValidatedFormField
            key={field.name}
            field={field}
            value={formData[field.name] || ""}
            onChange={handleFieldChange}
            errorMessage={combinedErrors[field.name]}
            isDisabled={isPending}
            size="lg"
          />
        ))}

        <input type="hidden" name="redirectTo" value="/" />

        <Button
          variant="secondary"
          fullWidth
          type="submit"
          isLoading={isPending}
          isDisabled={isFormInvalid}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
