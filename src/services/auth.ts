"use server";

import type { AuthResponse, ErrorResponse, LoginFormData, UserSession } from "@/types";
import { apiClient } from "./api";
import { API_ROUTE_ENDPOINT, DOMAIN } from "@/constants/api";
import { EXCEPTION_ERROR_MESSAGE } from "@/constants/message";
import { signOut } from "@/lib/auth/auth";

export const login = async (
  body: LoginFormData
): Promise<{ user: UserSession | null; error: string | null }> => {
  try {
    const response = await apiClient.post<AuthResponse>(API_ROUTE_ENDPOINT.LOGIN, {
      body: {
        identifier: body.email,
        password: body.password,
      },
      baseUrl: DOMAIN,
    });

    const { error, jwt, user } = response;

    if (error && !user) {
      return {
        user: null,
        error: (JSON.parse(error) as ErrorResponse).error.message,
      };
    }

    const data = {
      id: user?.id || "",
      token: jwt,
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "",
    };

    return { user: data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : EXCEPTION_ERROR_MESSAGE.LOGIN;

    return {
      user: null,
      error: errorMessage,
    };
  }
};

export const logout = async () => await signOut();
