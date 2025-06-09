import { API_ENDPOINTS } from "@/constants";
import { apiClient } from "@/services/api";
import type { ArticleStrapiModel } from "@/types";

type Params = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  const searchParams = new URLSearchParams();
  searchParams.set("populate", "*");
  const { id } = await params;
  const res = await apiClient.get<ArticleStrapiModel>(
    `${API_ENDPOINTS.ARTICLES}/${id}?${decodeURIComponent(searchParams.toString())}`
  );

  return Response.json(res);
}
