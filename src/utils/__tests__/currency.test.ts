import { formatUSD } from "../currency";

describe("currency utilities", () => {
  describe("formatUSD function", () => {
    it("should format basic amounts correctly", () => {
      expect(formatUSD(0)).toBe("$0.00");
      expect(formatUSD(1)).toBe("$0.01");
      expect(formatUSD(5)).toBe("$0.05");
      expect(formatUSD(100)).toBe("$1.00");
      expect(formatUSD(1999)).toBe("$19.99");
      expect(formatUSD(2995)).toBe("$29.95");
    });

    it("should handle large amounts with thousands separators", () => {
      expect(formatUSD(999999)).toBe("$9,999.99");
      expect(formatUSD(1000000)).toBe("$10,000.00");
      expect(formatUSD(123456789)).toBe("$1,234,567.89");
      expect(formatUSD(500000000)).toBe("$5,000,000.00");
    });

    it("should handle edge cases", () => {
      expect(formatUSD(-1999)).toBe("-$19.99");
      expect(formatUSD(123.45)).toBe("$1.23");
    });
  });
});
