import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const strapiBaseURL = process.env.STRAPI_URL || "http://localhost:1337";

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const res = await fetch(`${strapiBaseURL}/api/auth/local`, {
            method: "POST",
            body: JSON.stringify({
              identifier: credentials?.email,
              password: credentials?.password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();

          if (data.error) {
            return null;
          }

          return {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            jwt: data.jwt,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        jwt: token.jwt,
      };
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnStore = nextUrl.pathname.startsWith("/store");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/store", nextUrl));
        }
        return true;
      }

      if (isOnStore) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
