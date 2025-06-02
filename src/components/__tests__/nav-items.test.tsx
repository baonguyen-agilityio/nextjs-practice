import { render, screen } from "@testing-library/react";
import { NavItems } from "../layouts/Header/NavItems";
import { siteConfig } from "@/config/site";

// Mock NextAuth
jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

// Mock server actions
jest.mock("@/lib/actions", () => ({
  logout: jest.fn(),
}));

describe("NavItems", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders all nav items from siteConfig when not authenticated", async () => {
    const { auth } = jest.requireMock("@/lib/auth/auth");
    auth.mockResolvedValue(null);

    const NavItemsResolved = await NavItems();
    render(NavItemsResolved);

    // Check that navigation items are rendered
    siteConfig.navItems.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    // Check that login link is present when not authenticated
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders sign out button when authenticated", async () => {
    const { auth } = jest.requireMock("@/lib/auth/auth");
    auth.mockResolvedValue({
      user: { id: "1", email: "test@example.com" },
    });

    const NavItemsResolved = await NavItems();
    render(NavItemsResolved);

    // Check that sign out button is present when authenticated
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });
});
