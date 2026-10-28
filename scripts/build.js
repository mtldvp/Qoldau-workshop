import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = new URL("../dist/", import.meta.url);
const html = await readFile(
  new URL("../public/index.html", import.meta.url),
  "utf8",
);
if (!html.includes("<title>") || !html.includes("Qoldau")) {
  throw new Error(
    "The application HTML must contain a title and the project name.",
  );
}
await rm(dist, { recursive: true, force: true });
await mkdir(new URL("src/", dist), { recursive: true });
await cp(`${root}public`, new URL("public/", dist), { recursive: true });
await cp(`${root}src/server.js`, new URL("src/server.js", dist));
await writeFile(
  new URL("package.json", dist),
  JSON.stringify({ type: "module" }) + "\n",
);
console.log("Build complete: dist/ (no runtime dependencies)");
