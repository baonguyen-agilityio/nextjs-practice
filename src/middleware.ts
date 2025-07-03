import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export default auth((_req) => {
  // Generate a unique nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Allow 'unsafe-eval' in development for React's development builds
  const isDevelopment = process.env.NODE_ENV === "development";
  const unsafeEval = isDevelopment ? " 'unsafe-eval'" : "";

  // Define the CSP header with development-aware script-src policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${unsafeEval};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    frame-src 'self' https://vercel.live;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://valuable-health-c8a8ba9845.media.strapiapp.com;
  `;

  // Clean up the CSP header by removing newlines and extra spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

  // Create response with CSP headers
  const response = NextResponse.next();

  // Set CSP headers on the response
  response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
  response.headers.set("x-nonce", nonce);

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Also exclude prefetch requests
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
