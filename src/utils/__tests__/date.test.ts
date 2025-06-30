import { formatDate } from "../date";

describe("date utilities", () => {
  describe("formatDate function", () => {
    it("should format valid date strings correctly", () => {
      expect(formatDate("2024-03-15T10:30:00.000Z")).toBe("March 15, 2024");
      expect(formatDate("2024-01-05T00:00:00.000Z")).toBe("January 5, 2024");
      expect(formatDate("2024-02-29T12:00:00.000Z")).toBe("February 29, 2024");
      expect(formatDate("2024-06-15T14:30:00+05:30")).toBe("June 15, 2024");
      expect(formatDate("2024-05-10")).toBe("May 10, 2024");
    });

    it("should handle invalid date strings", () => {
      expect(formatDate("invalid-date-string")).toBe("Invalid date");
      expect(formatDate("")).toBe("Invalid date");
    });
  });
});
