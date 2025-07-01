import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the cn utility
jest.mock("@/utils/cn", () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(" ")),
}));

// Mock @heroui/react with all definitions inside
jest.mock("@heroui/react", () => {
  const MockSelect = React.forwardRef<any, any>(
    ({ children, className, classNames, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="select-component"
        data-classname={className}
        data-classnames={JSON.stringify(classNames)}
        {...props}
      >
        {children}
      </div>
    )
  );
  MockSelect.displayName = "MockSelect";

  const MockSelectItem = ({ children, ...props }: any) => (
    <div data-testid="select-item" {...props}>
      {children}
    </div>
  );

  const mockExtendVariants = jest.fn((component) => component);

  return {
    Select: MockSelect,
    SelectItem: MockSelectItem,
    extendVariants: mockExtendVariants,
  };
});

// Import components after mocking
import { Select, SelectItem } from "../index";
import { cn } from "@/utils/cn";

describe("Select Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default styling", () => {
    render(
      <Select label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const selectElement = screen.getByTestId("select-component");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveAttribute("data-classname", "font-inter");
  });

  it("merges custom className with default font-inter class", () => {
    render(
      <Select className="custom-class" label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const selectElement = screen.getByTestId("select-component");
    expect(selectElement).toHaveAttribute("data-classname", "font-inter custom-class");
  });

  it("applies default classNames and merges with custom classNames", () => {
    const customClassNames = {
      base: "custom-base",
      trigger: "custom-trigger",
    };

    render(
      <Select classNames={customClassNames} label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const selectElement = screen.getByTestId("select-component");
    const classNamesData = JSON.parse(selectElement.getAttribute("data-classnames") || "{}");

    // Check that default classNames are applied and custom ones override
    expect(classNamesData.base).toBe("custom-base"); // Custom overrides default
    expect(classNamesData.trigger).toBe("custom-trigger"); // Custom overrides default
    expect(classNamesData.label).toBe("font-inter text-[14px]"); // Default applied
    expect(classNamesData.value).toBe("font-inter text-[14px]"); // Default applied
    expect(classNamesData.listboxWrapper).toBe("font-inter"); // Default applied
    expect(classNamesData.listbox).toBe("font-inter"); // Default applied
    expect(classNamesData.popoverContent).toBe("font-inter"); // Default applied
  });

  it("passes through all other props", () => {
    render(
      <Select label="Test Select" placeholder="Choose option" data-testid="custom-test-id" disabled>
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const selectElement = screen.getByTestId("custom-test-id");
    expect(selectElement).toHaveAttribute("label", "Test Select");
    expect(selectElement).toHaveAttribute("placeholder", "Choose option");
    expect(selectElement).toHaveAttribute("data-testid", "custom-test-id");
    expect(selectElement).toHaveAttribute("disabled");
  });

  it("handles undefined className", () => {
    render(
      <Select label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const selectElement = screen.getByTestId("select-component");
    expect(selectElement).toHaveAttribute("data-classname", "font-inter");
  });

  it("handles undefined classNames", () => {
    render(
      <Select label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    const selectElement = screen.getByTestId("select-component");
    const classNamesData = JSON.parse(selectElement.getAttribute("data-classnames") || "{}");

    // Check that only default classNames are applied
    expect(classNamesData.base).toBe("font-inter");
    expect(classNamesData.trigger).toBe("font-inter text-[14px]");
    expect(classNamesData.label).toBe("font-inter text-[14px]");
    expect(classNamesData.value).toBe("font-inter text-[14px]");
    expect(classNamesData.listboxWrapper).toBe("font-inter");
    expect(classNamesData.listbox).toBe("font-inter");
    expect(classNamesData.popoverContent).toBe("font-inter");
  });

  it("calls cn utility with correct arguments", () => {
    render(
      <Select className="custom-class" label="Test Select">
        <SelectItem key="option1">Option 1</SelectItem>
      </Select>
    );

    expect(cn).toHaveBeenCalledWith("font-inter", "custom-class");
  });
});

describe("SelectItem Export", () => {
  it("renders SelectItem correctly", () => {
    render(<SelectItem key="test">Test Item</SelectItem>);

    const item = screen.getByTestId("select-item");
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent("Test Item");
  });
});
