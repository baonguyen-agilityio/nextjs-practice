import { render, screen } from "@testing-library/react";
import { Header } from "../index";
import type { Session } from "next-auth";

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

import { auth } from "@/lib/auth/auth";
const mockAuth = auth as unknown as jest.MockedFunction<() => Promise<Session | null>>;

jest.mock("next/link", () => {
  return function MockLink({ children, href, className, ...props }: any) {
    return (
      <a href={href} className={className} {...props}>
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

jest.mock("../NavItems", () => ({
  NavItems: function MockNavItems({ session }: { session: Session | null }) {
    return (
      <div data-testid="nav-items">
        {session ? `Logged in as ${session.user?.email}` : "Not logged in"}
      </div>
    );
  },
}));

jest.mock("../MobileMenu", () => ({
  MobileMenu: function MockMobileMenu() {
    return <div data-testid="mobile-menu">Mobile Menu</div>;
  },
}));

jest.mock("@/config/site", () => ({
  siteConfig: {
    socialLinks: [
      {
        icon: function MockIcon() {
          return <span>FB</span>;
        },
        href: "https://facebook.com",
        label: "Facebook",
      },
      {
        icon: function MockIcon() {
          return <span>TW</span>;
        },
        href: "https://twitter.com",
        label: "Twitter",
      },
    ],
  },
}));

const createMockSession = (overrides: Partial<Session> = {}): Session => ({
  user: {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    role: "user",
    token: "token123",
  },
  expires: "2024-12-31T23:59:59.999Z",
  ...overrides,
});

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render header with logo and navigation when not logged in", async () => {
    mockAuth.mockResolvedValue(null);

    const HeaderComponent = await Header();
    render(HeaderComponent);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
    expect(screen.getByTestId("nav-items")).toHaveTextContent("Not logged in");
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("should render header with session when logged in", async () => {
    const mockSession = createMockSession({
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        token: "token123",
      },
    });
    mockAuth.mockResolvedValue(mockSession);

    const HeaderComponent = await Header();
    render(HeaderComponent);

    expect(screen.getByTestId("nav-items")).toHaveTextContent("Logged in as test@example.com");
  });

  it("should render logo link with correct href", async () => {
    mockAuth.mockResolvedValue(null);

    const HeaderComponent = await Header();
    render(HeaderComponent);

    const logoLink = screen.getByLabelText("BookStore Home");
    expect(logoLink).toHaveAttribute("href", "/");
    expect(logoLink).toContainElement(screen.getByTestId("logo"));
  });

  it("should render social media links", async () => {
    mockAuth.mockResolvedValue(null);

    const HeaderComponent = await Header();
    render(HeaderComponent);

    expect(screen.getByLabelText("Visit our Facebook page (opens in new window)")).toHaveAttribute(
      "href",
      "https://facebook.com"
    );
    expect(screen.getByLabelText("Visit our Twitter page (opens in new window)")).toHaveAttribute(
      "href",
      "https://twitter.com"
    );
  });

  it("should call auth function", async () => {
    mockAuth.mockResolvedValue(null);

    await Header();

    expect(mockAuth).toHaveBeenCalledTimes(1);
  });
});
