import type { Category, ImageStrapiModel, MetaResponse } from "@/types";
export interface BookStrapiModel {
  id: string;
  slug: string;
  title: string;
  price: number;
  language: string;
  description: string;
  image: ImageStrapiModel;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId: string;
}

export type Book = Omit<BookStrapiModel, "image"> & {
  imageUrl: string;
};

export type BookDataResponse = Promise<{ book: Book | null; error: string | null } & MetaResponse>;
export type BooksDataResponse = Promise<{ books: Book[]; error: string | null } & MetaResponse>;

export type BooksStrapiResponse = {
  data: BookStrapiModel[];
  meta: MetaResponse;
};

export type BookStrapiResponse = {
  data: BookStrapiModel;
  error: string | null;
};

export type BookPayload = {
  title: string;
  price: number;
  description: string;
  language?: string;
  category?: string;
  image?: string;
};
