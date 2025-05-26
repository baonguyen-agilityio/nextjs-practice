import { render, screen } from "@testing-library/react";
import { Header } from "../header/main-header";
import { siteConfig } from "@/config/site";

jest.mock("../icons/logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo" />,
}));

jest.mock("../header/nav-items", () => ({
  NavItems: () => <div data-testid="nav-items" />,
}));

jest.mock("../header/cart-button", () => ({
  CartButton: () => <div data-testid="cart-button" />,
}));

jest.mock("../header/mobile-menu", () => ({
  MobileMenu: () => <div data-testid="mobile-menu" />,
}));

describe("Header", () => {
  it("renders logo and brand name", () => {
    render(<Header />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
  });

  it("renders social links", () => {
    render(<Header />);
    const socialLinks = screen.getAllByRole("link", { name: "" });
    expect(socialLinks).toHaveLength(siteConfig.socialLinks.length);
    siteConfig.socialLinks.forEach(({ href }, i) => {
      expect(socialLinks[i]).toHaveAttribute("href", href);
    });
  });

  it("renders NavItems, CartButton, and MobileMenu", () => {
    render(<Header />);
    expect(screen.getByTestId("nav-items")).toBeInTheDocument();
    expect(screen.getByTestId("cart-button")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
