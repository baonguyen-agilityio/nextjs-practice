import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (token) Object.assign(token, user);
      return token;
    },
    async session({ session, token }) {
      Object.assign(session.user, token);
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
} satisfies NextAuthConfig;
