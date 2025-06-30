import React from "react";
import { render, screen } from "@testing-library/react";
import { FormField } from "../index";

const MockInput = React.forwardRef<any, any>(
  ({ label, isRequired, isInvalid, errorMessage, ...props }, ref) => (
    <div data-testid="input-wrapper">
      <label data-testid="input-label">
        {label}
        {isRequired && " *"}
      </label>
      <input ref={ref} data-testid="input-field" data-invalid={isInvalid} {...props} />
      {errorMessage && (
        <span data-testid="error-message" data-invalid={isInvalid}>
          {errorMessage}
        </span>
      )}
    </div>
  )
);

MockInput.displayName = "MockInput";

jest.mock("@/components/ui/Input", () => ({
  Input: MockInput,
}));

describe("FormField", () => {
  const defaultProps = {
    name: "testField",
    label: "Test Field",
  };

  it("should render with basic props", () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByTestId("input-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("input-label")).toHaveTextContent("Test Field");
    expect(screen.getByTestId("input-field")).toHaveAttribute("id", "testField");
    expect(screen.getByTestId("input-field")).toHaveAttribute("name", "testField");
  });

  it("should render required field", () => {
    render(<FormField {...defaultProps} required />);

    expect(screen.getByTestId("input-label")).toHaveTextContent("Test Field *");
    expect(screen.getByTestId("input-field")).toHaveAttribute("data-testid", "input-field");
  });

  it("should display error message as string", () => {
    render(<FormField {...defaultProps} errorMessage="This field is required" />);

    expect(screen.getByTestId("error-message")).toHaveTextContent("This field is required");
    expect(screen.getByTestId("input-field")).toHaveAttribute("data-invalid", "true");
    expect(screen.getByTestId("error-message")).toHaveAttribute("data-invalid", "true");
  });

  it("should display error message as array", () => {
    const errorMessages = ["Error 1", "Error 2"];
    render(<FormField {...defaultProps} errorMessage={errorMessages} />);

    expect(screen.getByTestId("error-message")).toHaveTextContent("Error 1, Error 2");
    expect(screen.getByTestId("input-field")).toHaveAttribute("data-invalid", "true");
  });

  it("should display help text when no error", () => {
    render(<FormField {...defaultProps} helpText="This is help text" />);

    expect(screen.getByText("This is help text")).toBeInTheDocument();
    expect(screen.getByText("This is help text")).toHaveClass(
      "text-small",
      "text-default-500",
      "mt-1"
    );
  });

  it("should not display help text when there is an error", () => {
    render(
      <FormField
        {...defaultProps}
        errorMessage="This field is required"
        helpText="This is help text"
      />
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent("This field is required");
    expect(screen.queryByText("This is help text")).not.toBeInTheDocument();
  });

  it("should apply container className", () => {
    render(<FormField {...defaultProps} containerClassName="custom-container" />);

    const container = screen.getByTestId("input-wrapper").parentElement;
    expect(container).toHaveClass("w-full", "custom-container");
  });

  it("should pass through input props", () => {
    render(
      <FormField {...defaultProps} placeholder="Enter text" disabled className="custom-input" />
    );

    const input = screen.getByTestId("input-field");
    expect(input).toHaveAttribute("placeholder", "Enter text");
    expect(input).toHaveAttribute("disabled");
  });

  it("should handle empty error message array", () => {
    render(<FormField {...defaultProps} errorMessage={[]} />);

    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    expect(screen.getByTestId("input-field")).toHaveAttribute("data-invalid", "false");
  });

  it("should handle empty string error message", () => {
    render(<FormField {...defaultProps} errorMessage="" />);

    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    expect(screen.getByTestId("input-field")).toHaveAttribute("data-invalid", "false");
  });
});
