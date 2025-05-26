import { render, screen } from "@testing-library/react";
import { NavItems } from "../header/nav-items";
import { siteConfig } from "@/config/site";

describe("NavItems", () => {
  it("renders all nav items from siteConfig", () => {
    render(<NavItems />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(siteConfig.navItems.length);
    siteConfig.navItems.forEach(({ label, href }, i) => {
      expect(links[i]).toHaveTextContent(label);
      expect(links[i]).toHaveAttribute("href", href);
    });
  });
});
