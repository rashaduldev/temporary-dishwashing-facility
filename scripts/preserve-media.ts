import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { createHash } from "node:crypto";

function inside(root: string, path: string) {
  const target = resolve(root, "." + path),
    rel = relative(root, target);
  if (
    rel === ".." ||
    rel.startsWith("..\\") ||
    rel.startsWith("../") ||
    isAbsolute(rel)
  )
    throw new Error("Asset path escapes its output directory");
  return target;
}

export async function preserveMedia(media: Record<string, { local?: string }>) {
  const restored = [];
  for (const [source, record] of Object.entries(media)) {
    if (!record.local) continue;
    const url = new URL(source);
    if (
      !["temporary123.com", "www.temporary123.com"].includes(url.hostname) ||
      !url.pathname.startsWith("/wp-content/uploads/")
    )
      continue;
    const sourceFile = inside(resolve("public"), record.local);
    const destination = inside(
      resolve("dist"),
      decodeURIComponent(url.pathname),
    );
    const bytes = await readFile(sourceFile);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(sourceFile, destination);
    restored.push({
      source,
      path: url.pathname,
      local: record.local,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  return restored;
}
