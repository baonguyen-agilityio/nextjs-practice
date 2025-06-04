import type { APIRelatedResponse, APIResponse, MetaResponse } from "@/types";

export interface ImageModel {
  url: string;
}

export interface BookModel {
  title: string;
  description: string;
  image: APIRelatedResponse<APIResponse<ImageModel>>;
  slug: string;
  price: number;
}

export type BookResponse = APIResponse<BookModel>;

export type BooksDataResponse = Promise<
  { books: BookResponse[]; error: string | null } & MetaResponse
>;

export type BooksResponse = {
  data: BookResponse[];
  meta: MetaResponse;
};
