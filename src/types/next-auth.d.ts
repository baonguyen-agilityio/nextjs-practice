import "next-auth";
import { JWT } from "next-auth/jwt"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { UserSession } from "@/types";

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }
}
