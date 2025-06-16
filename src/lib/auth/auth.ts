import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/services/auth";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          if (process.env.NODE_ENV === "development") {
            console.error("Invalid credentials:", parsedCredentials.error.flatten());
          }
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const { user, error } = await login({ email, password });
        if (error || !user) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Login failed:", error);
          }
          return null;
        }

        const meRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=role`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!meRes.ok) return null;

        const userData = await meRes.json();

        return {
          id: userData.id,
          email: userData.email,
          name: userData.username,
          token: user.token,
          role: userData.role?.type || "user",
        };
      },
    }),
  ],
});
