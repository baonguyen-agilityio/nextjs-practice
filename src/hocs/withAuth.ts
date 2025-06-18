import { validateAuthHeader } from "@/utils/auth";

export const withAuth = (handler: (req: Request, token: string) => Promise<Response>) => {
  return async (req: Request) => {
    const authError = validateAuthHeader(req);
    if (authError) return authError;

    const token = req.headers.get("Authorization") || "";

    return handler(req, token);
  };
};
