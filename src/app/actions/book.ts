"use server";

import { createBookService, deleteBook, updateBookService } from "@/services/book";
import { createBookSchema, updateBookSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { uploadImage } from "@/lib/utils/image";
import type { BookPayload } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: Record<string, string[]> | string };

async function handleBookAction(
  formData: FormData,
  schema: typeof createBookSchema | typeof updateBookSchema,
  action: "create" | "update"
): Promise<ActionResult> {
  const image = formData.get("image") as File | null;

  if (action === "create" && (!image || image.size === 0)) {
    return { success: false, error: { image: ["Image is required"] } };
  }

  const raw = Object.fromEntries([...formData.entries()].filter(([key]) => key !== "image"));
  const result = schema.safeParse(raw);

  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  try {
    let uploadedImageId: string | null = null;
    if (image && image.size > 0) {
      uploadedImageId = await uploadImage(image);
    }

    const payload: BookPayload = {
      ...result.data,
      ...(uploadedImageId && { image: uploadedImageId }),
    };

    if (action === "create") {
      const { error } = await createBookService(payload);
      if (error) {
        return { success: false, error };
      }
    } else if (action === "update") {
      const { error } = await updateBookService(raw.documentId as string, payload);
      if (error) {
        return { success: false, error };
      }
    }

    revalidateTag(API_ENDPOINTS.BOOKS);
    return {
      success: true,
      message: action === "create" ? "Book created successfully" : "Book updated successfully",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : `Error ${action}ing book`;
    return { success: false, error: message };
  }
}

export async function createBook(_: unknown, formData: FormData): Promise<ActionResult> {
  return handleBookAction(formData, createBookSchema, "create");
}

export async function updateBook(_: unknown, formData: FormData): Promise<ActionResult> {
  return handleBookAction(formData, updateBookSchema, "update");
}

export async function deleteBookAction(_: unknown, formData: FormData): Promise<ActionResult> {
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing book ID" };

  const { error } = await deleteBook({ id });
  if (error) {
    return { success: false, error };
  }

  revalidateTag(API_ENDPOINTS.BOOKS);
  return { success: true, message: "Book deleted successfully" };
}
