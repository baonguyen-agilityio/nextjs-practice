import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import type { BooksStrapiResponse, BookStrapiResponse } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const res = await apiClient.get<BooksStrapiResponse>(
    `${API_ENDPOINTS.BOOKS}?${decodeURIComponent(searchParams.toString())}`
  );

  return Response.json(res);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await apiClient.post<BookStrapiResponse>(`${API_ENDPOINTS.BOOKS}`, {
    body,
  });

  return Response.json(res);
}
