import { next } from "@vercel/functions";

export const config = {
  matcher: "/seo/dashboard/:path*",
};

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export default function middleware(): Response {
  return next({ headers: privateHeaders });
}
