/**
 * Static server for the rendered preview.
 *
 * Deliberately dependency-free — this exists only to look at `out/`.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const PORT = 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".js": "text/javascript; charset=utf-8",
};

createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (path === "/") path = "/index.html";

  let file = join(OUT, path);

  // Allow extensionless Shopify-style URLs as well as the written .html files.
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
  } catch {
    if (!extname(file)) file += ".html";
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404</h1><p>Not in the rendered preview.</p>");
  }
}).listen(PORT, () => {
  console.log(`Shopify theme preview: http://localhost:${PORT}`);
});
