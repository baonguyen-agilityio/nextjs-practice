import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@heroui/react";

describe("Input Component", () => {
  it("should render input with placeholder", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("should render input with label", () => {
    render(<Input label="Username" placeholder="Enter username" />);

    const input = screen.getByLabelText("Username");
    expect(input).toBeInTheDocument();
  });
});
