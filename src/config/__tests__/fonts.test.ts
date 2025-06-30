import { fontCardo, fontInter } from "../fonts";

jest.mock("next/font/google", () => ({
  Cardo: jest.fn(() => ({
    className: "font-cardo",
    variable: "--font-cardo",
    style: {
      fontFamily: "Cardo, serif",
    },
  })),
  Inter: jest.fn(() => ({
    className: "font-inter",
    variable: "--font-inter",
    style: {
      fontFamily: "Inter, sans-serif",
    },
  })),
}));

describe("Fonts Configuration", () => {
  it("should export fontCardo with correct properties", () => {
    expect(fontCardo).toBeDefined();
    expect(fontCardo.variable).toBe("--font-cardo");
    expect(fontCardo.className).toBe("font-cardo");
  });

  it("should export fontInter with correct properties", () => {
    expect(fontInter).toBeDefined();
    expect(fontInter.variable).toBe("--font-inter");
    expect(fontInter.className).toBe("font-inter");
  });

  it("should have different font configurations", () => {
    expect(fontCardo.variable).not.toBe(fontInter.variable);
    expect(fontCardo.className).not.toBe(fontInter.className);
  });
});
