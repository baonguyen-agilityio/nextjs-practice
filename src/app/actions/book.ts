"use server";

import { updateBookSchema } from "@/schemas";

export async function updateBook(prevState: any, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const result = updateBookSchema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { data } = result;
  try {
    console.log(data);
  } catch (error) {
    console.error(error);
    return "Error updating book";
  }
}

export async function deleteBook(prevState: any, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  console.log(raw);
}
