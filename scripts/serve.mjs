import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, relative, isAbsolute } from "node:path";
const root = resolve("dist");
const { redirects = [], headers = [] } = JSON.parse(
  await readFile("vercel.json", "utf8"),
);
http
  .createServer(async (req, res) => {
    for (const rule of headers.filter((rule) => rule.source === "/(.*)")) {
      const host = (req.headers.host || "").split(":")[0];
      if (
        rule.has?.some(
          (condition) =>
            condition.type === "host" &&
            !new RegExp(`^${condition.value}$`, "i").test(host),
        )
      )
        continue;
      if (
        rule.missing?.some(
          (condition) =>
            condition.type === "host" &&
            new RegExp(`^${condition.value}$`, "i").test(host),
        )
      )
        continue;
      for (const header of rule.headers)
        res.setHeader(header.key, header.value);
    }
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const redirect = redirects.find((rule) => {
      const pattern = rule.source
        .split("/")
        .map((segment) =>
          segment
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/:[A-Za-z0-9_]+/g, "[^/]+"),
        )
        .join("/");
      return new RegExp(`^${pattern}$`).test(path);
    });
    if (redirect) {
      const destination = new URL(redirect.destination, "http://localhost");
      for (const [key, value] of new URL(req.url, "http://localhost")
        .searchParams) {
        if (!destination.searchParams.has(key))
          destination.searchParams.append(key, value);
      }
      res
        .writeHead(308, {
          Location: destination.pathname + destination.search,
        })
        .end();
      return;
    }
    if (path.startsWith("/api/")) {
      res
        .writeHead(503, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        })
        .end(
          JSON.stringify({
            error:
              "Local static preview. Run Vercel dev with staging credentials for inquiries.",
          }),
        );
      return;
    }
    const file = resolve(root, "." + path),
      within = relative(root, file);
    if (
      within === ".." ||
      within.startsWith("..\\") ||
      within.startsWith("../") ||
      isAbsolute(within)
    ) {
      res.writeHead(403).end();
      return;
    }
    try {
      const info = await stat(file);
      if (info.isDirectory() && !path.endsWith("/")) {
        res
          .writeHead(308, {
            Location: path + "/" + new URL(req.url, "http://localhost").search,
          })
          .end();
        return;
      }
      const target = info.isDirectory() ? file + "/index.html" : file;
      const data = await readFile(target);
      const types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".svg": "image/svg+xml",
        ".xml": "application/xml",
        ".txt": "text/plain",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".webp": "image/webp",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".pdf": "application/pdf",
      };
      res
        .writeHead(200, {
          "Content-Type": types[extname(target)] || "application/octet-stream",
        })
        .end(data);
    } catch {
      res
        .writeHead(404, { "Content-Type": "text/html" })
        .end(await readFile(root + "/404.html"));
    }
  })
  .listen(4173, "0.0.0.0", () => console.log("Preview: http://localhost:4173"));
