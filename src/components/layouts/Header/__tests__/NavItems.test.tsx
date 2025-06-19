import { render, screen } from "@testing-library/react";
import { NavItems } from "../NavItems";
import type { Session } from "next-auth";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/config/site", () => ({
  siteConfig: {
    navItems: [
      { href: "/books", label: "Store" },
      { href: "/articles", label: "Articles" },
      { href: "/about", label: "About" },
    ],
  },
}));

jest.mock("@/app/actions", () => ({
  logout: jest.fn(),
}));

jest.mock("@/components/features/cart/CartModal", () => {
  return function MockCartModal() {
    return <div data-testid="cart-modal">Cart Modal</div>;
  };
});

jest.mock("next/link", () => {
  return function MockLink({ children, href, className, ...props }: any) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  };
});

import { usePathname } from "next/navigation";
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

const createMockSession = (role: string = "user"): Session => ({
  user: {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    role,
    token: "token123",
  },
  expires: "2024-12-31T23:59:59.999Z",
});

describe("NavItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  describe("Navigation rendering", () => {
    it("should render all navigation items", () => {
      render(<NavItems session={null} />);

      expect(screen.getByText("Store")).toBeInTheDocument();
      expect(screen.getByText("Articles")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("should highlight active link based on pathname", () => {
      mockUsePathname.mockReturnValue("/books");

      render(<NavItems session={null} />);

      const storeLink = screen.getByText("Store");
      expect(storeLink).toHaveClass("text-secondary");
    });

    it("should show white text for non-active links", () => {
      mockUsePathname.mockReturnValue("/other");

      render(<NavItems session={null} />);

      const storeLink = screen.getByText("Store");
      expect(storeLink).toHaveClass("text-white");
    });
  });

  describe("Authentication states", () => {
    it("should show login link when not authenticated", () => {
      render(<NavItems session={null} />);

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
      expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
    });

    it("should show sign out button when authenticated", () => {
      const session = createMockSession();
      render(<NavItems session={session} />);

      expect(screen.getByText("Sign Out")).toBeInTheDocument();
      expect(screen.getByLabelText("Sign out of your account")).toBeInTheDocument();
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });
  });

  describe("User role-based rendering", () => {
    it("should show cart modal for non-admin users", () => {
      const session = createMockSession("user");
      render(<NavItems session={session} />);

      expect(screen.getByTestId("cart-modal")).toBeInTheDocument();
    });

    it("should not show cart modal for admin users", () => {
      const session = createMockSession("admin");
      render(<NavItems session={session} />);

      expect(screen.queryByTestId("cart-modal")).not.toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should render navigation with correct CSS classes", () => {
      render(<NavItems session={null} />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass(
        "hidden",
        "md:flex",
        "items-center",
        "gap-8",
        "font-inter",
        "text-sm"
      );
    });

    it("should render logout form with correct structure", () => {
      const session = createMockSession();
      render(<NavItems session={session} />);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();

      const button = screen.getByText("Sign Out");
      expect(button.closest("form")).toBe(form);
    });
  });
});
