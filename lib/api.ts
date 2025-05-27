import { auth } from "@/app/auth";

const strapiBaseURL = process.env.STRAPI_URL || "http://localhost:1337";

export async function fetchFromStrapi(endpoint: string, options: RequestInit = {}) {
  const session = await auth();

  if (!session?.jwt) {
    throw new Error("No authentication token found");
  }

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.jwt}`,
    },
  };

  const response = await fetch(`${strapiBaseURL}/api${endpoint}`, {
    ...options,
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "An error occurred");
  }

  return data;
}
