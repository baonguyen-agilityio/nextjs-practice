import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateAuthHeader = (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token." }), {
      status: 401,
    });
  }

  return null;
};
