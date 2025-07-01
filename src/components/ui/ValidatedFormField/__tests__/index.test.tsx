import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ValidatedFormField } from "../index";
import type { FieldConfig } from "@/hooks/useFormValidation";

// Mock FormField component
jest.mock("@/components/ui/FormField", () => {
  const MockFormField = React.forwardRef<HTMLInputElement, any>(
    (
      {
        id,
        name,
        label,
        type,
        required,
        value,
        onChange,
        errorMessage,
        isDisabled,
        size,
        ...props
      },
      ref
    ) => (
      <div data-testid="form-field">
        <label htmlFor={id} data-testid="field-label">
          {label}
          {required && <span data-testid="required-indicator">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={required}
          data-testid="field-input"
          data-size={size}
          {...props}
        />
        {errorMessage && <span data-testid="error-message">{errorMessage}</span>}
      </div>
    )
  );
  MockFormField.displayName = "MockFormField";

  return {
    FormField: MockFormField,
  };
});

describe("ValidatedFormField", () => {
  const mockOnChange = jest.fn();

  const basicField: FieldConfig = {
    name: "testField",
    label: "Test Field",
    type: "text",
    required: false,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Basic functionality", () => {
    it("renders with basic props", () => {
      render(<ValidatedFormField field={basicField} value="" onChange={mockOnChange} />);

      expect(screen.getByTestId("form-field")).toBeInTheDocument();
      expect(screen.getByTestId("field-label")).toHaveTextContent("Test Field");
      expect(screen.getByTestId("field-input")).toHaveAttribute("name", "testField");
      expect(screen.getByTestId("field-input")).toHaveAttribute("type", "text");
      expect(screen.getByTestId("field-input")).toHaveAttribute("id", "testField");
    });

    it("displays the current value", () => {
      render(<ValidatedFormField field={basicField} value="test value" onChange={mockOnChange} />);

      expect(screen.getByTestId("field-input")).toHaveValue("test value");
    });

    it("calls onChange with field name and value", () => {
      render(<ValidatedFormField field={basicField} value="" onChange={mockOnChange} />);

      fireEvent.change(screen.getByTestId("field-input"), { target: { value: "new value" } });

      expect(mockOnChange).toHaveBeenCalledWith("testField", "new value");
    });
  });

  describe("Field configuration", () => {
    it("renders required field", () => {
      const requiredField: FieldConfig = { ...basicField, required: true };

      render(<ValidatedFormField field={requiredField} value="" onChange={mockOnChange} />);

      expect(screen.getByTestId("required-indicator")).toBeInTheDocument();
      expect(screen.getByTestId("field-input")).toHaveAttribute("required");
    });

    it("renders different field types", () => {
      const emailField: FieldConfig = { ...basicField, type: "email" };

      render(<ValidatedFormField field={emailField} value="" onChange={mockOnChange} />);

      expect(screen.getByTestId("field-input")).toHaveAttribute("type", "email");
    });
  });

  describe("Optional props", () => {
    it("renders with error message", () => {
      render(
        <ValidatedFormField
          field={basicField}
          value=""
          onChange={mockOnChange}
          errorMessage="This field is required"
        />
      );

      expect(screen.getByTestId("error-message")).toHaveTextContent("This field is required");
    });

    it("renders disabled state", () => {
      render(
        <ValidatedFormField field={basicField} value="" onChange={mockOnChange} isDisabled={true} />
      );

      expect(screen.getByTestId("field-input")).toBeDisabled();
    });

    it("uses default size (lg)", () => {
      render(<ValidatedFormField field={basicField} value="" onChange={mockOnChange} />);

      expect(screen.getByTestId("field-input")).toHaveAttribute("data-size", "lg");
    });

    it("renders with custom size sm", () => {
      render(<ValidatedFormField field={basicField} value="" onChange={mockOnChange} size="sm" />);

      expect(screen.getByTestId("field-input")).toHaveAttribute("data-size", "sm");
    });

    it("renders with custom size md", () => {
      render(<ValidatedFormField field={basicField} value="" onChange={mockOnChange} size="md" />);

      expect(screen.getByTestId("field-input")).toHaveAttribute("data-size", "md");
    });
  });

  describe("Ref forwarding and additional props", () => {
    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<ValidatedFormField ref={ref} field={basicField} value="" onChange={mockOnChange} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("passes additional props to FormField", () => {
      render(
        <ValidatedFormField
          field={basicField}
          value=""
          onChange={mockOnChange}
          placeholder="Enter text"
          data-custom="test"
        />
      );

      const input = screen.getByTestId("field-input");
      expect(input).toHaveAttribute("placeholder", "Enter text");
      expect(input).toHaveAttribute("data-custom", "test");
    });
  });

  describe("Component metadata", () => {
    it("has correct displayName", () => {
      expect(ValidatedFormField.displayName).toBe("ValidatedFormField");
    });
  });
});
