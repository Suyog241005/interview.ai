/**
 * One origin policy for both Express CORS and Better Auth's trustedOrigins.
 *
 * CORS_ORIGINS unset or "*"  -> every origin is allowed (current default, per product decision).
 * CORS_ORIGINS="https://a.com,https://b.com" -> only those, plus localhost for development.
 *
 * Responses carry credentials (session cookies), so "allow every origin" means any site a signed-in
 * user visits can call the API as that user. Set CORS_ORIGINS in production to close that.
 */
const configured = (process.env.CORS_ORIGINS ?? "*")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const allowAnyOrigin = configured.length === 0 || configured.includes("*");

export function isAllowedOrigin(origin: string | undefined | null): boolean {
  if (!origin) return true; // same-origin, curl, server-to-server
  if (allowAnyOrigin) return true;
  if (configured.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
