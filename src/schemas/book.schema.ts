import { z } from "zod";

export const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.preprocess(
    (val) => {
      const num = parseFloat(val as string);
      return Number.isNaN(num) ? undefined : num;
    },
    z
      .number({ invalid_type_error: "Price must be a number", required_error: "Price is required" })
      .min(0, "Price must be greater than or equal to 0")
  ),
  language: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  categories: z.string().min(1, "Category is required"),
});

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.preprocess(
    (val) => {
      const num = parseFloat(val as string);
      return Number.isNaN(num) ? undefined : num;
    },
    z
      .number({ invalid_type_error: "Price must be a number", required_error: "Price is required" })
      .min(0, "Price must be greater than or equal to 0")
  ),
  language: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  categories: z.string().min(1, "Category is required"),
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
