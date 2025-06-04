import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import type { AuthResponse } from "@/types";

export async function POST(req: Request) {
  const data = await req.json();
  const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH, {
    body: data,
  });
  return Response.json(res);
}
