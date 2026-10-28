import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../dist/src/server.js";

const server = createApp();
server.listen(0, "127.0.0.1");
await once(server, "listening");
const base = `http://127.0.0.1:${server.address().port}`;
try {
  const health = await fetch(`${base}/health`, {
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    status: "ok",
    project: "qoldau-workshop",
  });
  for (const [path, contentType, content] of [
    ["/", "text/html", "Qoldau"],
    ["/app.js", "text/javascript", "/health"],
    ["/styles.css", "text/css", ":root"],
    ["/favicon.svg", "image/svg+xml", "<svg"],
  ]) {
    const response = await fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(response.status, 200, path);
    assert.ok(
      response.headers.get("content-type").startsWith(contentType),
      path,
    );
    assert.ok((await response.text()).includes(content), path);
  }
  console.log(
    "Smoke passed: built server, health API, HTML, JS, CSS and favicon.",
  );
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
