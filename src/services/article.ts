import { EXCEPTION_ERROR_MESSAGE } from "@/constants/message";
import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN } from "@/constants";
import { apiClient } from "./api";
import type {
  ArticleDataResponse,
  ArticlesDataResponse,
  ArticlesStrapiResponse,
  ArticleStrapiResponse,
  ErrorResponse,
  FetchDataProps,
} from "@/types";

export const getArticles = async ({
  searchParams = new URLSearchParams(),
  options = { next: { tags: [API_ENDPOINTS.ARTICLES] } },
}: FetchDataProps): ArticlesDataResponse => {
  try {
    const params = new URLSearchParams(searchParams);
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.ARTICLES}?${params.toString()}`);
    const { data, meta, error } = await apiClient.get<ArticlesStrapiResponse & { error?: string }>(
      url,
      {
        ...options,
        next: {
          ...options.next,
          revalidate: 3600,
        },
        baseUrl: DOMAIN,
      }
    );

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { articles: [], error: errorResponse.error.message };
    }

    const articles = data.map(({ image, ...rest }) => {
      return {
        ...rest,
        imageUrl: image.url,
      };
    });

    return {
      articles: articles,
      ...meta,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("articles");

    return { articles: [], error: errorMessage };
  }
};

export const getArticle = async ({ id }: { id: string }): ArticleDataResponse => {
  try {
    const url = decodeURIComponent(`${API_ROUTE_ENDPOINT.ARTICLES}/${id}`);
    const { data, error } = await apiClient.get<ArticleStrapiResponse>(url, {
      next: {
        revalidate: 3600,
        tags: [API_ENDPOINTS.ARTICLES, id],
      },
      baseUrl: DOMAIN,
    });

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { article: null, error: errorResponse.error.message };
    }

    const { image, ...rest } = data;
    return { article: { ...rest, imageUrl: image.url || "" }, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("article");

    return { article: null, error: errorMessage };
  }
};
