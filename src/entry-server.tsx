import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import type { HelmetServerState } from "react-helmet-async";
import { AppShell } from "./AppShell";
import { AppRoutes } from "./AppRoutes";

// Build-time prerender entry, invoked by scripts/prerender.mjs.
export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <AppShell>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppShell>
    </HelmetProvider>,
  );
  return { html, helmet: helmetContext.helmet };
}
