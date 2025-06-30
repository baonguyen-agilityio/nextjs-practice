import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ValidatedFormField } from "../index";
import type { FieldConfig } from "@/hooks/useFormValidation";

const MockFormField = React.forwardRef<HTMLInputElement, any>(
  (
    { id, name, label, type, required, value, onChange, errorMessage, isDisabled, size, ...props },
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

jest.mock("@/components/ui/FormField", () => ({
  FormField: MockFormField,
}));

describe("ValidatedFormField", () => {
  const mockOnChange = jest.fn();

  const defaultField: FieldConfig = {
    name: "testField",
    label: "Test Field",
    type: "text",
    required: false,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with basic props", () => {
    render(<ValidatedFormField field={defaultField} value="" onChange={mockOnChange} />);

    expect(screen.getByTestId("form-field")).toBeInTheDocument();
    expect(screen.getByTestId("field-label")).toHaveTextContent("Test Field");
    expect(screen.getByTestId("field-input")).toHaveAttribute("name", "testField");
    expect(screen.getByTestId("field-input")).toHaveAttribute("type", "text");
  });

  it("renders with required field", () => {
    const requiredField: FieldConfig = {
      ...defaultField,
      required: true,
    };

    render(<ValidatedFormField field={requiredField} value="" onChange={mockOnChange} />);

    expect(screen.getByTestId("required-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("field-input")).toHaveAttribute("required");
  });

  it("renders with value", () => {
    render(<ValidatedFormField field={defaultField} value="test value" onChange={mockOnChange} />);

    expect(screen.getByTestId("field-input")).toHaveValue("test value");
  });

  it("handles onChange event", () => {
    render(<ValidatedFormField field={defaultField} value="" onChange={mockOnChange} />);

    const input = screen.getByTestId("field-input");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(mockOnChange).toHaveBeenCalledWith("testField", "new value");
  });

  it("renders with error message", () => {
    render(
      <ValidatedFormField
        field={defaultField}
        value=""
        onChange={mockOnChange}
        errorMessage="This field is required"
      />
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent("This field is required");
  });

  it("renders with disabled state", () => {
    render(
      <ValidatedFormField field={defaultField} value="" onChange={mockOnChange} isDisabled={true} />
    );

    expect(screen.getByTestId("field-input")).toBeDisabled();
  });

  it("renders with default size (lg)", () => {
    render(<ValidatedFormField field={defaultField} value="" onChange={mockOnChange} />);

    expect(screen.getByTestId("field-input")).toHaveAttribute("data-size", "lg");
  });

  it("renders with custom size", () => {
    render(<ValidatedFormField field={defaultField} value="" onChange={mockOnChange} size="sm" />);

    expect(screen.getByTestId("field-input")).toHaveAttribute("data-size", "sm");
  });

  it("renders with medium size", () => {
    render(<ValidatedFormField field={defaultField} value="" onChange={mockOnChange} size="md" />);

    expect(screen.getByTestId("field-input")).toHaveAttribute("data-size", "md");
  });

  it("renders with different field types", () => {
    const emailField: FieldConfig = {
      ...defaultField,
      type: "email",
    };

    render(<ValidatedFormField field={emailField} value="" onChange={mockOnChange} />);

    expect(screen.getByTestId("field-input")).toHaveAttribute("type", "email");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<ValidatedFormField ref={ref} field={defaultField} value="" onChange={mockOnChange} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes additional props to FormField", () => {
    render(
      <ValidatedFormField
        field={defaultField}
        value=""
        onChange={mockOnChange}
        placeholder="Enter text here"
        data-custom="custom-value"
      />
    );

    const input = screen.getByTestId("field-input");
    expect(input).toHaveAttribute("placeholder", "Enter text here");
    expect(input).toHaveAttribute("data-custom", "custom-value");
  });

  it("has correct displayName", () => {
    expect(ValidatedFormField.displayName).toBe("ValidatedFormField");
  });

  it("renders without error message when not provided", () => {
    render(<ValidatedFormField field={defaultField} value="" onChange={mockOnChange} />);

    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("renders with non-required field", () => {
    const nonRequiredField: FieldConfig = {
      ...defaultField,
      required: false,
    };

    render(<ValidatedFormField field={nonRequiredField} value="" onChange={mockOnChange} />);

    expect(screen.queryByTestId("required-indicator")).not.toBeInTheDocument();
  });
});
