import { formatDate } from "../date";

describe("date utilities", () => {
  describe("formatDate function", () => {
    it("should format valid date strings correctly", () => {
      expect(formatDate("2024-03-15T10:30:00.000Z")).toBe("15-03-2024");
      expect(formatDate("2024-01-05T00:00:00.000Z")).toBe("05-01-2024");
      expect(formatDate("2024-02-29T12:00:00.000Z")).toBe("29-02-2024");
      expect(formatDate("2024-06-15T14:30:00+05:30")).toBe("15-06-2024");
      expect(formatDate("2024-05-10")).toBe("10-05-2024");
    });

    it("should handle invalid date strings", () => {
      expect(formatDate("invalid-date-string")).toBe("NaN-NaN-NaN");
      expect(formatDate("")).toBe("NaN-NaN-NaN");
    });
  });
});
