import { z } from "zod";

export const updateBookSchema = z.object({
  id: z.string().min(1, "Missing book ID"),
  title: z.string().min(1, "Title is required"),
  price: z.preprocess((val) => parseFloat(val as string), z.number().min(0)),
  language: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;
