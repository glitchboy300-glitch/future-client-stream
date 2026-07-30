// Build-time prerender: renders each route to static HTML so crawlers
// (Google, Bing, GPTBot, ClaudeBot, PerplexityBot, social scrapers) get
// full content without executing JavaScript. Runs after the client and
// SSR builds; see the "build" script in package.json.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const routes = [
  { path: "/", out: "index.html" },
  { path: "/book", out: "book/index.html" },
  { path: "/confirmed", out: "confirmed/index.html" },
  { path: "/privacy", out: "privacy/index.html" },
  { path: "/terms", out: "terms/index.html" },
  // Renders the NotFound route; served by Netlify with a real 404 status.
  { path: "/__not-found__", out: "404.html" },
];

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
const serverEntry = pathToFileURL(path.resolve("dist/server/entry-server.js")).href;
const { render } = await import(serverEntry);

for (const route of routes) {
  const { html, helmet } = render(route.path);
  if (!html || html.length < 200) {
    throw new Error(`Prerender produced suspiciously small HTML for ${route.path} (${html.length} bytes)`);
  }

  let page = template;
  // Helmet owns title/description/canonical per page; strip the static ones.
  page = page.replace(/<title>[\s\S]*?<\/title>\n?/, "");
  page = page.replace(/\s*<meta name="description"[^>]*\/?>/, "");
  const headBits = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join("\n    ");
  page = page.replace("</head>", `    ${headBits}\n  </head>`);
  page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outPath = path.join(dist, route.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, page);
  console.log(`prerendered ${route.path} -> ${route.out} (${html.length} bytes)`);
}

// The SSR bundle is a build tool, not a deploy artifact.
fs.rmSync(path.join(dist, "server"), { recursive: true, force: true });
console.log("prerender complete");
