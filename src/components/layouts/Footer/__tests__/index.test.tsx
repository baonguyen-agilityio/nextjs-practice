import { render, screen } from "@testing-library/react";
import { Footer } from "../index";

jest.mock("next/link", () => {
  return function MockLink({ children, href, className, target, ...props }: any) {
    return (
      <a href={href} className={className} target={target} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("@/components/icons/logo", () => {
  return function MockLogo() {
    return <div data-testid="logo">Logo</div>;
  };
});

jest.mock("@/config/site", () => ({
  siteConfig: {
    socialLinks: [
      {
        icon: function MockIcon() {
          return <span data-testid="facebook-icon">FB</span>;
        },
        href: "https://facebook.com",
        label: "Facebook",
      },
      {
        icon: function MockIcon() {
          return <span data-testid="twitter-icon">TW</span>;
        },
        href: "https://twitter.com",
        label: "Twitter",
      },
      {
        icon: function MockIcon() {
          return <span data-testid="linkedin-icon">LI</span>;
        },
        href: "https://linkedin.com",
        label: "LinkedIn",
      },
    ],
  },
}));

describe("Footer", () => {
  it("should render footer with logo and brand", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
  });

  it("should render contact information", () => {
    render(<Footer />);

    expect(screen.getByText("Keep in Touch")).toBeInTheDocument();
    expect(screen.getByText("24A Kingston St, Los Vegas NC 28202, USA.")).toBeInTheDocument();
    expect(screen.getByText("support@doctors.com")).toBeInTheDocument();
    expect(screen.getByText("(+22) 123 - 4567 - 900")).toBeInTheDocument();
  });

  it("should render social media links and icons", () => {
    render(<Footer />);

    expect(screen.getByTestId("facebook-icon")).toBeInTheDocument();
    expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
    expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
  });

  it("should render copyright text", () => {
    render(<Footer />);

    expect(screen.getByText("Copyright © 2024 - All rights reserved.")).toBeInTheDocument();
  });
});
