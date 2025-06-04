export const validateAuthHeader = (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token." }), {
      status: 401,
    });
  }

  return null;
};
