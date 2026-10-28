import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/favicon.svg", ["favicon.svg", "image/svg+xml"]],
]);

export function createApp({
  publicDir = fileURLToPath(new URL("../public/", import.meta.url)),
} = {}) {
  return createServer(async (request, response) => {
    const send = (
      status,
      body,
      contentType = "application/json; charset=utf-8",
    ) => {
      response.writeHead(status, {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      });
      response.end(request.method === "HEAD" ? undefined : body);
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      response.setHeader("Allow", "GET, HEAD");
      send(405, JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    let pathname;
    try {
      pathname = new URL(request.url, "http://localhost").pathname;
    } catch {
      send(400, JSON.stringify({ error: "Invalid URL" }));
      return;
    }

    if (pathname === "/health") {
      send(200, JSON.stringify({ status: "ok", project: "qoldau-workshop" }));
      return;
    }

    const file = files.get(pathname);
    if (!file) {
      send(404, JSON.stringify({ error: "Not found" }));
      return;
    }

    try {
      const body = await readFile(resolve(publicDir, file[0]));
      send(200, body, file[1]);
    } catch {
      send(
        503,
        JSON.stringify({
          error: "Application files unavailable. Run npm run build.",
        }),
      );
    }
  });
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }
  const host = process.env.HOST ?? "127.0.0.1";
  const server = createApp();
  server.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
  server.listen(port, host, () =>
    console.log(`Qoldau workshop: http://${host}:${port}`),
  );
  const shutdown = () => server.close();
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}
