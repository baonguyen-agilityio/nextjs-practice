import { formatDate } from "../date";

describe("date utilities", () => {
  describe("formatDate function", () => {
    it("should format a valid ISO date string correctly", () => {
      const isoDate = "2024-03-15T10:30:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("15-03-2024");
    });

    it("should handle single digit days and months with zero padding", () => {
      const isoDate = "2024-01-05T00:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("05-01-2024");
    });

    it("should handle year transitions", () => {
      const isoDate = "2023-12-31T12:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("31-12-2023");
    });

    it("should handle leap year dates", () => {
      const isoDate = "2024-02-29T12:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("29-02-2024");
    });

    it("should handle January 1st", () => {
      const isoDate = "2024-01-01T00:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("01-01-2024");
    });

    it("should handle December 31st", () => {
      const isoDate = "2024-12-31T12:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("31-12-2024");
    });

    it("should handle different time zones", () => {
      const isoDate = "2024-06-15T14:30:00+05:30";
      const result = formatDate(isoDate);
      expect(result).toBe("15-06-2024");
    });

    it("should handle date without time zone", () => {
      const isoDate = "2024-07-20T08:45:00";
      const result = formatDate(isoDate);
      expect(result).toBe("20-07-2024");
    });

    it("should handle current date", () => {
      const now = new Date();
      const isoDate = now.toISOString();
      const result = formatDate(isoDate);

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const expected = `${day}-${month}-${year}`;

      expect(result).toBe(expected);
    });

    it("should handle very old dates", () => {
      const isoDate = "1900-01-01T00:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("01-01-1900");
    });

    it("should handle far future dates", () => {
      const isoDate = "2100-12-31T12:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toBe("31-12-2100");
    });

    it("should handle invalid date strings gracefully", () => {
      const invalidDate = "invalid-date-string";
      const result = formatDate(invalidDate);
      expect(result).toBe("NaN-NaN-NaN");
    });

    it("should handle empty string", () => {
      const result = formatDate("");
      expect(result).toBe("NaN-NaN-NaN");
    });

    it("should handle date-only ISO string", () => {
      const isoDate = "2024-05-10";
      const result = formatDate(isoDate);
      expect(result).toBe("10-05-2024");
    });
  });
});
