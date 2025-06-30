import React from "react";
import { render, screen } from "@testing-library/react";
import { Select, SelectItem } from "../index";

const MockSelect = React.forwardRef<any, any>(
  ({ children, className, classNames, ...props }, ref) => (
    <select ref={ref} className={className} data-testid="hero-select" {...props}>
      {children}
    </select>
  )
);

MockSelect.displayName = "MockSelect";

const MockSelectItem = ({ children, ...props }: any) => (
  <option data-testid="select-item" {...props}>
    {children}
  </option>
);

MockSelectItem.displayName = "MockSelectItem";

jest.mock("@heroui/react", () => ({
  Select: MockSelect,
  SelectItem: MockSelectItem,
  extendVariants: jest.fn((component) => component),
}));

describe("Select", () => {
  it("should render select component", () => {
    render(
      <Select label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );

    expect(screen.getByTestId("hero-select")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(
      <Select className="custom-class" label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const select = screen.getByTestId("hero-select");
    expect(select).toHaveClass("custom-class");
  });

  it("should render SelectItem components", () => {
    render(
      <Select label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
        <SelectItem key="option2">Option 2</SelectItem>
      </Select>
    );

    const selectItems = screen.getAllByTestId("select-item");
    expect(selectItems).toHaveLength(2);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("should pass through props", () => {
    render(
      <Select label="Test Select" placeholder="Choose an option" data-testid="custom-select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const select = screen.getByTestId("custom-select");
    expect(select).toHaveAttribute("placeholder", "Choose an option");
    expect(select).toHaveAttribute("data-testid", "custom-select");
  });
});
