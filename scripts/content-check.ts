import { readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
const index = JSON.parse(readFileSync("content/route-index.json", "utf8")) as {
  path: string;
  file: string;
}[];
const pages = index.map((p) => {
  const body = JSON.parse(
    gunzipSync(readFileSync("content/pages/" + p.file)).toString(),
  ).html as string;
  return {
    path: p.path,
    bytes: Buffer.byteLength(body),
    hash: createHash("sha256").update(body).digest("hex"),
    empty: !body.trim(),
    unsafe: /<(script|iframe|form|style)\b|\son\w+=|href="javascript:/i.test(
      body,
    ),
  };
});
writeFileSync(
  "audit/content-review.json",
  JSON.stringify(
    {
      scope:
        "Recovered public WordPress page bodies after HTML sanitization. Original source facts require editorial verification; recovery is not full migration approval.",
      count: pages.length,
      empty: pages.filter((p) => p.empty).length,
      unsafe: pages.filter((p) => p.unsafe),
      exactDuplicateBodies:
        pages.length - new Set(pages.map((p) => p.hash)).size,
      pages,
    },
    null,
    2,
  ),
);
if (pages.some((p) => p.unsafe)) throw Error("Unsafe imported markup");
console.log(
  "Reviewed",
  pages.length,
  "source bodies; empty and duplicate records are documented.",
);
