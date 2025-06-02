import { render, screen } from "@testing-library/react";
import { Header } from "../layouts/Header";
import { siteConfig } from "@/config/site";

jest.mock("../icons/logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo" />,
}));

jest.mock("../layouts/Header/NavItems", () => ({
  NavItems: () => (
    <div data-testid="nav-items">
      <div data-testid="cart-button" />
    </div>
  ),
}));

jest.mock("../layouts/Header/MobileMenu", () => ({
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
    // Get all links with target="_blank" (these are the social links)
    const socialLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(socialLinks).toHaveLength(siteConfig.socialLinks.length);
    siteConfig.socialLinks.forEach(({ href }) => {
      const link = socialLinks.find((l) => l.getAttribute("href") === href);
      expect(link).toBeInTheDocument();
    });
  });

  it("renders logo link", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: /pages/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders NavItems and MobileMenu", () => {
    render(<Header />);
    expect(screen.getByTestId("nav-items")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("renders cart button within nav items", () => {
    render(<Header />);
    expect(screen.getByTestId("cart-button")).toBeInTheDocument();
  });
});
