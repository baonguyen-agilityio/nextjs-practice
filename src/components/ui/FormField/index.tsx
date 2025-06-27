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
          className={className}
          {...inputProps}
        />
        {!hasError && helpText && <p className="text-small text-default-500 mt-1">{helpText}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
