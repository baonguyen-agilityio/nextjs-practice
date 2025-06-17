import { formatUSD } from "../currency";

describe("currency utilities", () => {
  describe("formatUSD function", () => {
    it("should format cents to USD correctly", () => {
      const cents = 1999;
      const result = formatUSD(cents);
      expect(result).toBe("$19.99");
    });

    it("should handle zero cents", () => {
      const cents = 0;
      const result = formatUSD(cents);
      expect(result).toBe("$0.00");
    });

    it("should handle single digit cents", () => {
      const cents = 5;
      const result = formatUSD(cents);
      expect(result).toBe("$0.05");
    });

    it("should handle exactly one dollar", () => {
      const cents = 100;
      const result = formatUSD(cents);
      expect(result).toBe("$1.00");
    });

    it("should handle large amounts", () => {
      const cents = 123456789;
      const result = formatUSD(cents);
      expect(result).toBe("$1,234,567.89");
    });

    it("should handle amounts with thousands separators", () => {
      const cents = 999999;
      const result = formatUSD(cents);
      expect(result).toBe("$9,999.99");
    });

    it("should handle amounts over a million", () => {
      const cents = 1000000;
      const result = formatUSD(cents);
      expect(result).toBe("$10,000.00");
    });

    it("should handle fractional cents by rounding", () => {
      const cents = 123.45;
      const result = formatUSD(cents);
      expect(result).toBe("$1.23");
    });

    it("should handle negative amounts", () => {
      const cents = -1999;
      const result = formatUSD(cents);
      expect(result).toBe("-$19.99");
    });

    it("should handle very small positive amounts", () => {
      const cents = 1;
      const result = formatUSD(cents);
      expect(result).toBe("$0.01");
    });

    it("should handle typical book prices", () => {
      const cents = 2995; // $29.95
      const result = formatUSD(cents);
      expect(result).toBe("$29.95");
    });

    it("should handle round dollar amounts", () => {
      const cents = 2500; // $25.00
      const result = formatUSD(cents);
      expect(result).toBe("$25.00");
    });

    it("should handle price with 99 cents", () => {
      const cents = 1499; // $14.99
      const result = formatUSD(cents);
      expect(result).toBe("$14.99");
    });

    it("should handle very large amounts with proper formatting", () => {
      const cents = 500000000; // $5,000,000.00
      const result = formatUSD(cents);
      expect(result).toBe("$5,000,000.00");
    });
  });
});
