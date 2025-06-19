import { render, screen } from "@testing-library/react";
import { MobileMenu } from "../MobileMenu";
import type { Session } from "next-auth";

jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
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

jest.mock("../MobileMenuToggle", () => ({
  MobileMenuToggle: function MockMobileMenuToggle({ children }: { children: React.ReactNode }) {
    return <div data-testid="mobile-menu-toggle">{children}</div>;
  },
}));

jest.mock("next/link", () => {
  return function MockLink({ children, href, className, ...props }: any) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  };
});

import { auth } from "@/lib/auth/auth";
const mockAuth = auth as unknown as jest.MockedFunction<() => Promise<Session | null>>;

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

describe("MobileMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Navigation rendering", () => {
    it("should render all navigation items with correct links", async () => {
      mockAuth.mockResolvedValue(null);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      expect(screen.getByText("Store")).toHaveAttribute("href", "/books");
      expect(screen.getByText("Articles")).toHaveAttribute("href", "/articles");
      expect(screen.getByText("About")).toHaveAttribute("href", "/about");
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("Authentication states", () => {
    it("should show login link when not authenticated", async () => {
      mockAuth.mockResolvedValue(null);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
      expect(screen.queryByText("Sign Out")).not.toBeInTheDocument();
      expect(mockAuth).toHaveBeenCalledTimes(1);
    });

    it("should show sign out button when authenticated", async () => {
      const session = createMockSession();
      mockAuth.mockResolvedValue(session);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      expect(screen.getByText("Sign Out")).toBeInTheDocument();
      expect(screen.getByLabelText("Sign out of your account")).toBeInTheDocument();
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });
  });

  describe("User role-based rendering", () => {
    it("should show cart modal for non-admin users", async () => {
      const session = createMockSession("user");
      mockAuth.mockResolvedValue(session);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      expect(screen.getByTestId("cart-modal")).toBeInTheDocument();
    });

    it("should not show cart modal for admin users", async () => {
      const session = createMockSession("admin");
      mockAuth.mockResolvedValue(session);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      expect(screen.queryByTestId("cart-modal")).not.toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });

  describe("Component structure", () => {
    it("should render within MobileMenuToggle wrapper", async () => {
      mockAuth.mockResolvedValue(null);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      expect(screen.getByTestId("mobile-menu-toggle")).toBeInTheDocument();
    });

    it("should render logout form when authenticated", async () => {
      const session = createMockSession();
      mockAuth.mockResolvedValue(session);

      const MobileMenuComponent = await MobileMenu();
      render(MobileMenuComponent);

      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(screen.getByText("Sign Out").closest("form")).toBe(form);
    });
  });

  describe("Edge cases", () => {
    it("should handle auth rejection", async () => {
      mockAuth.mockRejectedValue(new Error("Auth failed"));

      await expect(MobileMenu()).rejects.toThrow("Auth failed");
    });
  });
});
