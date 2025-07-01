import React from "react";
import { render, screen } from "@testing-library/react";
import { FormField } from "../index";

jest.mock("@/components/ui/Input", () => {
  const MockInput = React.forwardRef<any, any>(
    ({ label, isRequired, isInvalid, id, name, ...props }, ref) => (
      <div data-testid="input-wrapper">
        <label data-testid="input-label">
          {label}
          {isRequired && " *"}
        </label>
        <input
          ref={ref}
          data-testid="input-field"
          data-invalid={isInvalid}
          id={id}
          name={name}
          {...props}
        />
      </div>
    )
  );
  MockInput.displayName = "MockInput";

  return {
    Input: MockInput,
  };
});

describe("FormField", () => {
  const defaultProps = {
    name: "testField",
    label: "Test Field",
  };

  it("renders with basic props", () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByTestId("input-label")).toHaveTextContent("Test Field");
    expect(screen.getByTestId("input-field")).toHaveAttribute("id", "testField");
    expect(screen.getByTestId("input-field")).toHaveAttribute("name", "testField");
  });

  it("renders required field with asterisk", () => {
    render(<FormField {...defaultProps} required />);

    expect(screen.getByTestId("input-label")).toHaveTextContent("Test Field *");
  });

  it("displays error message", () => {
    render(<FormField {...defaultProps} errorMessage="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByTestId("input-field")).toHaveAttribute("data-invalid", "true");
  });

  it("displays help text when no error", () => {
    render(<FormField {...defaultProps} helpText="This is help text" />);

    expect(screen.getByText("This is help text")).toBeInTheDocument();
  });

  it("hides help text when there is an error", () => {
    render(<FormField {...defaultProps} errorMessage="Error message" helpText="Help text" />);

    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });

  it("passes through input props", () => {
    render(<FormField {...defaultProps} placeholder="Enter text" disabled />);

    const input = screen.getByTestId("input-field");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("disabled");
  });
});
