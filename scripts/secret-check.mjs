import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";
const excluded = new Set([
  ".git",
  "node_modules",
  ".vercel",
  "archive",
  "input",
  "test-results",
  "playwright-report",
]);
const patterns = [
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
  /(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}/,
  /(?:AKIA|ASIA)[A-Z0-9]{16}/,
  /\b(?:sk_live_|sk-proj-)[A-Za-z0-9_-]{24,}/,
  /\bRESEND_API_KEY\s*=\s*re_[A-Za-z0-9]{20,}/,
];
let scanned = 0;
const findings = [];
async function walk(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (
      [
        ".ts",
        ".tsx",
        ".js",
        ".mjs",
        ".json",
        ".yml",
        ".yaml",
        ".html",
        ".md",
        ".txt",
        ".example",
      ].includes(extname(path))
    ) {
      scanned++;
      const text = await readFile(path, "utf8");
      if (patterns.some((pattern) => pattern.test(text))) findings.push(path);
    }
  }
}
await walk(".");
console.log(
  JSON.stringify(
    {
      scanned,
      findings,
      note: "Pattern scan of source and built text; credential and cloud IAM review remain separate.",
    },
    null,
    2,
  ),
);
if (findings.length) process.exitCode = 1;
