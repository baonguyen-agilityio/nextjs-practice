import { TAGS } from "@/constants";
import { apiClient } from "./api";
import { API_ROUTE_ENDPOINT, DOMAIN } from "@/constants/api";
import type { UserSession } from "@/types/user";

export const getUser = async (): Promise<UserSession> => {
  try {
    const api = await apiClient.apiClientSession();
    const res = await api.get<UserSession>(`${API_ROUTE_ENDPOINT.USER}`, {
      next: {
        revalidate: 3600,
        tags: [TAGS.USER],
      },
      baseUrl: DOMAIN,
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
