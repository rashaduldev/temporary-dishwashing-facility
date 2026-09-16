import { next } from "@vercel/functions";

export const config = {
  matcher: "/seo/dashboard/:path*",
};

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function denied(status: 401 | 404): Response {
  const headers = new Headers(privateHeaders);
  if (status === 401) {
    headers.set("WWW-Authenticate", 'Basic realm="Owner SEO dashboard", charset="UTF-8"');
  }
  return new Response(status === 404 ? "Not found" : "Authentication required", {
    status,
    headers,
  });
}

function readBasicCredentials(header: string | null): [string, string] | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const encoded = header.slice(6).trim();
    const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const separator = decoded.indexOf(":");
    if (separator < 1) return null;
    return [decoded.slice(0, separator), decoded.slice(separator + 1)];
  } catch {
    return null;
  }
}

async function constantTimeEqual(actual: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(actual)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const actualBytes = new Uint8Array(actualHash);
  const expectedBytes = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < actualBytes.length; index += 1) {
    difference |= actualBytes[index] ^ expectedBytes[index];
  }
  return difference === 0;
}

export default async function middleware(request: Request): Promise<Response> {
  const expectedUsername = process.env.SEO_DASHBOARD_USERNAME;
  const expectedPassword = process.env.SEO_DASHBOARD_PASSWORD;

  // Fail closed and conceal the private route until both secrets are configured.
  if (!expectedUsername || !expectedPassword) return denied(404);

  const credentials = readBasicCredentials(request.headers.get("authorization"));
  if (!credentials) return denied(401);

  const [usernameMatches, passwordMatches] = await Promise.all([
    constantTimeEqual(credentials[0], expectedUsername),
    constantTimeEqual(credentials[1], expectedPassword),
  ]);
  if (!usernameMatches || !passwordMatches) return denied(401);

  return next({ headers: privateHeaders });
}
