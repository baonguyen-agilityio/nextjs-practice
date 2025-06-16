import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import type { CategoryStrapiResponse } from "@/types";

export async function GET() {
  const res = await apiClient.get<CategoryStrapiResponse>(`${API_ENDPOINTS.CATEGORIES}`);

  return Response.json(res);
}
