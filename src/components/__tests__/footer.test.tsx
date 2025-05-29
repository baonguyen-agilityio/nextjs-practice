import { render, screen } from "@testing-library/react";
import { Footer } from "../footer";
import { siteConfig } from "@/config/site";

jest.mock("../icons/logo", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-logo">Logo</div>,
}));

describe("Footer", () => {
  it("renders the logo and brand name", () => {
    render(<Footer />);
    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
  });

  it("renders social links", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const socialLinks = links.slice(0, siteConfig.socialLinks.length);
    socialLinks.forEach((link, i) => {
      const socialLink = siteConfig.socialLinks[i];
      if (socialLink) {
        expect(link).toHaveAttribute("href", socialLink.href);
        expect(link).toHaveAttribute("target", "_blank");
      }
    });
  });

  it("renders contact information", () => {
    render(<Footer />);
    expect(screen.getByText(/Address:/)).toBeInTheDocument();
    expect(screen.getByText(/Mail:/)).toBeInTheDocument();
    expect(screen.getByText(/Phone:/)).toBeInTheDocument();
    expect(screen.getByText(/24A Kingston St/)).toBeInTheDocument();
    expect(screen.getByText(/support@doctors.com/)).toBeInTheDocument();
    expect(screen.getByText("(+22) 123 - 4567 - 900")).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright © 2024 - All rights reserved./)).toBeInTheDocument();
  });
});
