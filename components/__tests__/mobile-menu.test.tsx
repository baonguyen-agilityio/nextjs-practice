import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMenu } from "../header/mobile-menu";
import { siteConfig } from "@/config/site";

jest.mock("../header/cart-button", () => ({
  CartButton: () => <div data-testid="cart-button" />,
}));

describe("MobileMenu", () => {
  it("renders the toggle button", () => {
    render(<MobileMenu />);
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeInTheDocument();
  });

  it("opens the menu when toggle button is clicked", () => {
    render(<MobileMenu />);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    siteConfig.navItems.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    expect(screen.getByTestId("cart-button")).toBeInTheDocument();
  });

  it("closes the menu when close button is clicked", () => {
    render(<MobileMenu />);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleButton);
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(screen.queryByRole("button", { name: /close menu/i })).not.toBeInTheDocument();
  });
});
