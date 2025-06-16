import { API_ENDPOINTS, API_ROUTE_ENDPOINT, DOMAIN, EXCEPTION_ERROR_MESSAGE } from "@/constants";
import { apiClient } from "@/services/api";
import type { CategoryStrapiResponse, ErrorResponse } from "@/types";

export const getCategories = async (): Promise<CategoryStrapiResponse> => {
  try {
    const { data, error } = await apiClient.get<CategoryStrapiResponse>(
      `${API_ROUTE_ENDPOINT.CATEGORIES}`,
      {
        cache: "force-cache",
        next: {
          tags: [API_ENDPOINTS.CATEGORIES],
        },
        baseUrl: DOMAIN,
      }
    );

    if (error) {
      const errorResponse = JSON.parse(error) as ErrorResponse;
      return { data: [], error: errorResponse.error.message };
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.GET("category");

    return { data: [], error: errorMessage };
  }
};
