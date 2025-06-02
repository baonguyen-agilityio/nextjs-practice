import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMenu } from "../layouts/Header/MobileMenu";
import { siteConfig } from "@/config/site";

// Mock NextAuth
jest.mock("@/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

// Mock server actions
jest.mock("@/lib/actions", () => ({
  logout: jest.fn(),
}));

jest.mock("../layouts/Header/CartButton", () => ({
  CartButton: () => <div data-testid="cart-button" />,
}));

describe("MobileMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { auth } = jest.requireMock("@/lib/auth/auth");
    auth.mockResolvedValue(null);
  });

  it("renders the toggle button", async () => {
    const MobileMenuResolved = await MobileMenu();
    render(MobileMenuResolved);
    expect(screen.getByRole("button", { name: /toggle menu/i })).toBeInTheDocument();
  });

  it("opens the menu when toggle button is clicked", async () => {
    const MobileMenuResolved = await MobileMenu();
    render(MobileMenuResolved);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    siteConfig.navItems.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("closes the menu when close button is clicked", async () => {
    const MobileMenuResolved = await MobileMenu();
    render(MobileMenuResolved);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleButton);
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(screen.queryByRole("button", { name: /close menu/i })).not.toBeInTheDocument();
  });
});
