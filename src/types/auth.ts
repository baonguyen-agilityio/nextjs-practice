import type { UserSession } from "@/types";

export interface LoginFormData {
  email: string;
  password: string;
}

export type AuthResponse = {
  jwt: string;
  user: UserSession | null;
  error: string | null;
};
