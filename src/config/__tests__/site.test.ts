import { siteConfig } from "../site";

describe("Site Configuration", () => {
  it("should have valid site config structure", () => {
    expect(siteConfig).toBeDefined();
    expect(siteConfig.name).toBeDefined();
    expect(siteConfig.name).toBe("Pages");
  });

  it("should have navigation items", () => {
    expect(siteConfig.navItems).toBeDefined();
    expect(Array.isArray(siteConfig.navItems)).toBe(true);
    expect(siteConfig.navItems.length).toBeGreaterThan(0);
  });

  it("should have social links", () => {
    expect(siteConfig.socialLinks).toBeDefined();
    expect(Array.isArray(siteConfig.socialLinks)).toBe(true);
    expect(siteConfig.socialLinks.length).toBeGreaterThan(0);
  });

  it("should have valid navigation item structure", () => {
    const firstItem = siteConfig.navItems[0];
    expect(firstItem?.href).toBeDefined();
    expect(firstItem?.label).toBeDefined();
  });
});
