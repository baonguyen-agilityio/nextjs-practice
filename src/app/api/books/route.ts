import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import type { BooksStrapiResponse } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const res = await apiClient.get<BooksStrapiResponse>(
    `${API_ENDPOINTS.BOOKS}?${decodeURIComponent(searchParams.toString())}`
  );

  return Response.json(res);
}
