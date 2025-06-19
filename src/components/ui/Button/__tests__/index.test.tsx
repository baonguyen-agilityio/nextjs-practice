import { render, screen } from "@testing-library/react";
import { Button } from "@heroui/react";

describe("Button Component", () => {
  it("should render button with children", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
  });

  it("should render button with different variants", () => {
    render(<Button variant="solid">Solid Button</Button>);

    const button = screen.getByRole("button", { name: "Solid Button" });
    expect(button).toBeInTheDocument();
  });

  it("should render disabled button", () => {
    render(<Button isDisabled>Disabled Button</Button>);

    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
  });
});
