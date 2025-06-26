import { headers } from "next/headers";

/**
 * Read the CSP nonce from request headers
 * This can only be used in Server Components
 * @returns The nonce string or null if not found
 */
export async function getNonce(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get("x-nonce");
  } catch (error) {
    console.warn("Failed to read nonce from headers:", error);
    return null;
  }
}
