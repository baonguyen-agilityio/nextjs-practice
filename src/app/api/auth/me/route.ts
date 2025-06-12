import { withAuth } from "@/hocs/withAuth";
import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import type { UserSession } from "@/types/user";

export const GET = withAuth(async (req: Request, token: string) => {
  const res = await apiClient.get<UserSession & { error: string | null }>(
    `${API_ENDPOINTS.USER}/me?populate=*`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return Response.json(res);
});
