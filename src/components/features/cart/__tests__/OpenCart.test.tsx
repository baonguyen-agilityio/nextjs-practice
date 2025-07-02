import { render, screen } from "@testing-library/react";
import { OpenCart } from "../OpenCart";

jest.mock("@/components/icons/cart-icon", () => {
  return function MockCartIcon() {
    return <div data-testid="cart-icon">Cart Icon</div>;
  };
});

describe("OpenCart", () => {
  it("should render cart icon", () => {
    render(<OpenCart />);

    expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
  });

  it("should not display quantity badge when no quantity provided", () => {
    render(<OpenCart />);

    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it("should not display quantity badge when quantity is 0", () => {
    render(<OpenCart quantity={0} />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("should display quantity badge when quantity is provided", () => {
    render(<OpenCart quantity={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should display correct quantity number", () => {
    render(<OpenCart quantity={12} />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("should have correct container classes", () => {
    const { container } = render(<OpenCart />);

    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass(
      "hover:opacity-80",
      "transition-opacity",
      "relative",
      "inline-block"
    );
  });

  it("should render quantity badge with correct classes when quantity exists", () => {
    const { container } = render(<OpenCart quantity={3} />);

    const badge = screen.getByText("3");
    expect(badge).toHaveClass(
      "absolute",
      "-top-3",
      "-right-3",
      "bg-secondary",
      "text-primary",
      "rounded-full",
      "w-6",
      "h-6",
      "flex",
      "items-center",
      "justify-center",
      "font-bold",
      "text-[10px]",
      "font-inter",
      "shadow"
    );
  });

  it("should handle single digit quantities", () => {
    render(<OpenCart quantity={1} />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle double digit quantities", () => {
    render(<OpenCart quantity={99} />);

    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("should handle large quantities by showing 99+", () => {
    render(<OpenCart quantity={999} />);

    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("should show 99+ for quantities over 99", () => {
    render(<OpenCart quantity={100} />);

    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("should position badge correctly", () => {
    render(<OpenCart quantity={5} />);

    const badge = screen.getByText("5");
    expect(badge).toHaveClass("absolute", "-top-3", "-right-3");
  });

  it("should render with proper semantic structure", () => {
    const { container } = render(<OpenCart quantity={5} />);

    const wrapper = container.firstChild;
    const icon = screen.getByTestId("cart-icon");
    const badge = screen.getByText("5");

    expect(wrapper).toContainElement(icon);
    expect(wrapper).toContainElement(badge);
  });

  it("should handle undefined quantity gracefully", () => {
    render(<OpenCart quantity={undefined} />);

    expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it("should use correct typography classes for badge", () => {
    render(<OpenCart quantity={7} />);

    const badge = screen.getByText("7");
    expect(badge).toHaveClass("font-bold", "text-[10px]", "font-inter");
  });

  it("should use correct background and text colors for badge", () => {
    render(<OpenCart quantity={4} />);

    const badge = screen.getByText("4");
    expect(badge).toHaveClass("bg-secondary", "text-primary");
  });
});
