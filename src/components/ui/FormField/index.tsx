import React from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";

export interface FormFieldProps extends React.ComponentProps<typeof Input> {
  name: string;
  label: string;
  errorMessage?: string | string[];
  helpText?: string;
  required?: boolean;
  containerClassName?: string;
}

export const FormField = React.forwardRef<React.ComponentRef<typeof Input>, FormFieldProps>(
  (
    { name, label, errorMessage, helpText, required, containerClassName, className, ...inputProps },
    ref
  ) => {
    const error = Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage;
    const hasError = Boolean(error);
    const helpTextId = `${name}-help`;
    const errorId = `${name}-error`;

    const describedByIds = [];
    if (helpText && !hasError) describedByIds.push(helpTextId);
    if (hasError) describedByIds.push(errorId);
    const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(" ") : undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        <Input
          ref={ref}
          id={name}
          name={name}
          label={label}
          isRequired={required}
          isInvalid={hasError}
          errorMessage={error}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className={className}
          {...inputProps}
        />
        {!hasError && helpText && (
          <p id={helpTextId} className="text-small text-default-500 mt-1" role="note">
            {helpText}
          </p>
        )}
        {hasError && (
          <p id={errorId} className="text-small text-danger mt-1" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
