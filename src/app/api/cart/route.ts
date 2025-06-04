import { API_ENDPOINTS } from "@/constants/api";
import { withAuth } from "@/hocs/withAuth";
import { apiClient } from "@/services/api";
import type { CartResponse } from "@/types";

export const GET = withAuth(async (req: Request, token: string) => {
  const { searchParams } = new URL(req.url);
  const res = await apiClient.get<CartResponse>(
    `${API_ENDPOINTS.CART}?${decodeURIComponent(searchParams.toString())}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return Response.json(res);
});
