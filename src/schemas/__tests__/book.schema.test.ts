import { updateBookSchema, createBookSchema } from "../book.schema";

describe("Book Schema", () => {
  const validBookData = {
    title: "Test Book",
    price: "29.99",
    language: "English",
    description: "A test book description",
    categories: "Fiction",
  };

  describe("updateBookSchema", () => {
    it("should validate valid book data", () => {
      const result = updateBookSchema.safeParse(validBookData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.title).toBe("Test Book");
        expect(result.data.price).toBe(29.99);
        expect(result.data.language).toBe("English");
        expect(result.data.description).toBe("A test book description");
        expect(result.data.categories).toBe("Fiction");
      }
    });

    it("should fail validation when title is empty", () => {
      const invalidData = { ...validBookData, title: "" };
      const result = updateBookSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Title is required");
      }
    });

    it("should fail validation when description is empty", () => {
      const invalidData = { ...validBookData, description: "" };
      const result = updateBookSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Description is required");
      }
    });

    it("should fail validation when categories is empty", () => {
      const invalidData = { ...validBookData, categories: "" };
      const result = updateBookSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Category is required");
      }
    });

    it("should validate price as number", () => {
      const dataWithNumericPrice = { ...validBookData, price: "50.00" };
      const result = updateBookSchema.safeParse(dataWithNumericPrice);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(50);
      }
    });

    it("should fail validation when price is negative", () => {
      const invalidData = { ...validBookData, price: "-10" };
      const result = updateBookSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Price must be greater than or equal to 0");
      }
    });

    it("should fail validation when price is not a number", () => {
      const invalidData = { ...validBookData, price: "not a number" };
      const result = updateBookSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Price is required");
      }
    });

    it("should allow zero price", () => {
      const dataWithZeroPrice = { ...validBookData, price: "0" };
      const result = updateBookSchema.safeParse(dataWithZeroPrice);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(0);
      }
    });

    it("should allow optional language field", () => {
      const { language, ...dataWithoutLanguage } = validBookData;

      const result = updateBookSchema.safeParse(dataWithoutLanguage);
      expect(result.success).toBe(true);
    });

    it("should handle undefined language", () => {
      const dataWithUndefinedLanguage = { ...validBookData, language: undefined };
      const result = updateBookSchema.safeParse(dataWithUndefinedLanguage);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBeUndefined();
      }
    });
  });

  describe("createBookSchema", () => {
    it("should validate valid book data", () => {
      const result = createBookSchema.safeParse(validBookData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.title).toBe("Test Book");
        expect(result.data.price).toBe(29.99);
        expect(result.data.language).toBe("English");
        expect(result.data.description).toBe("A test book description");
        expect(result.data.categories).toBe("Fiction");
      }
    });

    it("should fail validation when title is missing", () => {
      const { title, ...invalidData } = validBookData;

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should fail validation when price is missing", () => {
      const { price, ...invalidData } = validBookData;

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Price is required");
      }
    });

    it("should fail validation when description is missing", () => {
      const { description, ...invalidData } = validBookData;

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should fail validation when categories is missing", () => {
      const { categories, ...invalidData } = validBookData;

      const result = createBookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should handle decimal prices correctly", () => {
      const dataWithDecimalPrice = { ...validBookData, price: "19.95" };
      const result = createBookSchema.safeParse(dataWithDecimalPrice);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(19.95);
      }
    });

    it("should handle integer prices correctly", () => {
      const dataWithIntPrice = { ...validBookData, price: "25" };
      const result = createBookSchema.safeParse(dataWithIntPrice);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(25);
      }
    });
  });
});
