import { render, screen } from "@testing-library/react";
import { CartButton } from "../header/cart-button";

jest.mock("../icons/cart-icon", () => ({
  __esModule: true,
  default: () => <svg data-testid="cart-icon" />,
}));

describe("CartButton", () => {
  it("renders with default count", () => {
    render(<CartButton />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders with provided count", () => {
    render(<CartButton count={5} />);
    expect(screen.getByText("05")).toBeInTheDocument();
  });

  it("renders the cart icon", () => {
    render(<CartButton />);
    expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
  });

  it("links to /cart", () => {
    render(<CartButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/cart");
  });
});
