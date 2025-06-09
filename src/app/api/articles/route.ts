import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import type { ArticlesStrapiResponse } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const res = await apiClient.get<ArticlesStrapiResponse>(
    `${API_ENDPOINTS.ARTICLES}?${decodeURIComponent(searchParams.toString())}`
  );

  return Response.json(res);
}
