import { API_ENDPOINTS } from "@/constants";
import { apiClient } from "@/services/api";
import type { BookStrapiModel } from "@/types";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const searchParams = new URLSearchParams();
  searchParams.set("populate", "*");
  const { id } = await params;
  const res = await apiClient.get<BookStrapiModel>(
    `${API_ENDPOINTS.BOOKS}/${id}?${decodeURIComponent(searchParams.toString())}`
  );

  return Response.json(res);
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const body = await req.json();
  const res = await apiClient.put<BookStrapiModel>(`${API_ENDPOINTS.BOOKS}/${id}`, {
    body,
  });

  return Response.json(res);
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const { id } = await params;
  const res = await apiClient.delete(`${API_ENDPOINTS.BOOKS}/${id}`);
  return Response.json(res);
}
