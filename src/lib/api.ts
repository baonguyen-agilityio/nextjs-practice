import { auth } from "@/lib/auth/auth";

const strapiBaseURL = process.env.STRAPI_URL || "http://localhost:1337";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export async function fetchFromStrapi(endpoint: string, options: FetchOptions = {}) {
  const { auth: requiresAuth = true, ...restOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(restOptions.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const session = await auth();
    if (!session?.user?.token) {
      throw new Error("No authentication token found");
    }
    headers["Authorization"] = `Bearer ${session.user.token}`;
  }

  const response = await fetch(`${strapiBaseURL}/api${endpoint}`, {
    ...restOptions,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response from Strapi");
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || response.statusText || "Request failed");
  }

  return data;
}
