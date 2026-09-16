import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import ts from "typescript";

// Exercise emitted JavaScript with native Node resolution. Vitest/tsx resolve
// extensionless TS paths and cannot catch the corresponding Vercel ESM failure.
const output = resolve("node_modules/.cache/temp123-runtime");
await mkdir(output, { recursive: true });
await writeFile(resolve(output, "package.json"), '{"type":"module"}');
await writeFile(resolve(output, "site.json"), await readFile("site.json"));
for (const dir of ["api", "server"]) {
  await mkdir(resolve(output, dir), { recursive: true });
  for (const file of await readdir(dir)) {
    if (!file.endsWith(".ts")) continue;
    const { outputText } = ts.transpileModule(
      await readFile(`${dir}/${file}`, "utf8"),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
        fileName: file,
      },
    );
    await writeFile(
      resolve(output, dir, file.replace(/\.ts$/, ".js")),
      outputText,
    );
  }
}
process.env.CONTACT_ENABLED = "false";
process.env.CRON_SECRET = "synthetic-runtime-check-secret-32-bytes";
const { default: contact } = await import(
  pathToFileURL(resolve(output, "api/contact.js"))
);
const { default: deliver } = await import(
  pathToFileURL(resolve(output, "api/deliver.js"))
);
for (const [handler, method, expected] of [
  [contact, "GET", 405],
  [contact, "POST", 503],
  [deliver, "GET", 405],
  [deliver, "POST", 401],
]) {
  const headers = {};
  const response = {
    code: 0,
    setHeader(name, value) {
      headers[name] = value;
    },
    status(value) {
      this.code = value;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
  await handler(
    { method, headers: { authorization: "Bearer invalid" }, body: {} },
    response,
  );
  assert.equal(response.code, expected);
  assert.equal(headers["Cache-Control"], "private, no-store");
  assert.ok(response.body.error);
}
console.log(
  "Native Node server runtime: 4 safety boundary checks passed; no provider calls.",
);
