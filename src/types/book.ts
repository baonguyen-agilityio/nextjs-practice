import type { ImageStrapiModel, MetaResponse } from "@/types";
export interface BookStrapiModel {
  id: string;
  slug: string;
  title: string;
  price: number;
  language: string;
  description: string;
  image: ImageStrapiModel;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type Book = Omit<BookStrapiModel, "image"> & {
  imageUrl: string;
};

export type BooksDataResponse = Promise<{ books: Book[]; error: string | null } & MetaResponse>;

export type BooksStrapiResponse = {
  data: BookStrapiModel[];
  meta: MetaResponse;
};
