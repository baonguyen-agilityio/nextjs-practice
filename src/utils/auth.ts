export function validateAuthHeader(req: Request): Response | null {
  const authorization = req.headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}
