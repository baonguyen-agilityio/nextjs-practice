import type { ImageStrapiModel, MetaResponse } from "@/types";

export interface AuthorStrapiModel {
  name: string;
}

export interface ArticleStrapiModel {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image: ImageStrapiModel;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: AuthorStrapiModel;
  documentId: string;
}

export type Article = Omit<ArticleStrapiModel, "image"> & {
  imageUrl: string;
};

export type ArticleDataResponse = Promise<{ article: Article | null; error: string | null }>;

export type ArticlesDataResponse = Promise<
  { articles: Article[]; error: string | null } & MetaResponse
>;

export type ArticlesStrapiResponse = {
  data: ArticleStrapiModel[];
  meta: MetaResponse;
};

export type ArticleStrapiResponse = {
  data: ArticleStrapiModel;
  error: string | null;
};
