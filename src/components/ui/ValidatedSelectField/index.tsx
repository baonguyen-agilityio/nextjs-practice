import React from "react";
import { Select, SelectItem } from "@/components/ui/Select";

interface SelectOption {
  key: string;
  label: string;
  value: string;
}

interface ValidatedSelectFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  errorMessage?: string;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ValidatedSelectField: React.FC<ValidatedSelectFieldProps> = ({
  name,
  label,
  placeholder = "Select an option",
  required = false,
  value,
  onChange,
  options,
  errorMessage,
  isDisabled = false,
  size = "lg",
}) => {
  return (
    <div className="w-full">
      <Select
        name={name}
        label={label}
        placeholder={placeholder}
        isRequired={required}
        isDisabled={isDisabled}
        size={size}
        selectedKeys={value ? [value] : []}
        onSelectionChange={(keys) => {
          const selectedValue = Array.from(keys)[0] as string;
          onChange(selectedValue || "");
        }}
        errorMessage={errorMessage}
      >
        {options.map((option) => (
          <SelectItem key={option.key} aria-label={option.label}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export type { ValidatedSelectFieldProps, SelectOption };
