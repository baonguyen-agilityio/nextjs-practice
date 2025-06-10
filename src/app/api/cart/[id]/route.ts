import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const res = await apiClient.delete(`${API_ENDPOINTS.CART_ITEMS}/${id}`);

  return Response.json(res);
}
