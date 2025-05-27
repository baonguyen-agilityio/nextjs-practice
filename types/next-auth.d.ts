import "next-auth";
import { JWT } from "next-auth/jwt"; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    email: string;
    jwt: string;
  }

  interface Session {
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt: string;
  }
}
