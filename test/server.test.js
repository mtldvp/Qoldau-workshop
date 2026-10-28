import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import { createApp } from "../src/server.js";

let server;
let base;
before(async () => {
  server = createApp();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

test("health endpoint reports the running project", async () => {
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    project: "qoldau-workshop",
  });
});

test("home page and its assets are served with correct MIME types", async () => {
  for (const [path, mime] of [
    ["/", "text/html"],
    ["/app.js", "text/javascript"],
    ["/styles.css", "text/css"],
    ["/favicon.svg", "image/svg+xml"],
  ]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get("content-type").startsWith(mime), path);
    assert.ok((await response.text()).length > 0, path);
  }
});

test("unknown paths and attempts to read source files return 404", async () => {
  for (const path of [
    "/missing",
    "/package.json",
    "/src/server.js",
    "/%2e%2e/package.json",
  ]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 404, path);
    assert.deepEqual(await response.json(), { error: "Not found" });
  }
});

test("POST is rejected with allowed methods", async () => {
  const response = await fetch(`${base}/health`, { method: "POST" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("HEAD has the same content type and an empty body", async () => {
  const response = await fetch(base, { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.equal(await response.text(), "");
});

test("query strings do not change asset routing", async () => {
  const response = await fetch(`${base}/styles.css?v=1`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/css/);
});

test("missing application files return a useful error without stopping the server", async () => {
  const app = createApp({
    publicDir: new URL("../test/no-such-directory/", import.meta.url).pathname,
  });
  app.listen(0, "127.0.0.1");
  await once(app, "listening");
  try {
    const url = `http://127.0.0.1:${app.address().port}`;
    const response = await fetch(url);
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /npm run build/);
    assert.equal((await fetch(`${url}/health`)).status, 200);
  } finally {
    app.closeAllConnections();
    await new Promise((resolve) => app.close(resolve));
  }
});
