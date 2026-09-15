/**
 * Origin resolver for the *runtime-rendered* SEO endpoints (`robots.txt`,
 * `sitemap.xml`).
 *
 * The deployment ships a single image to every environment (Jenkins builds it
 * without env files; K8s injects the ConfigMap at container start), so any URL
 * baked into the build is guaranteed to be wrong for at least one environment.
 * That is exactly QA BUG-17: the SIT sitemap published 16 `<loc>` entries on
 * `www.remitech.ai`, which search engines reject because the host serving the
 * file is not the host named in it.
 *
 * Resolution order:
 *  1. explicit `SITE_URL` (ops override, wins so a CDN/Ingress re-write cannot
 *     silently change canonical output),
 *  2. the incoming request's own host,
 *  3. the build-time fallback in `siteConfig.url`.
 */
import { headers } from "next/headers";

import { siteConfig } from "@/config/site";

export async function requestOrigin(): Promise<string> {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  try {
    const h = await headers();
    // A proxy chain may send `a, b`; only the first hop is the public host.
    const host =
      h.get("x-forwarded-host")?.split(",")[0]?.trim() || h.get("host") || "";
    if (!host) return siteConfig.url;
    // Deliberately ignores `x-forwarded-proto`: the standalone server seeds it
    // with `http`, which would downgrade every public `<loc>` to a scheme we do
    // not serve. Only loopback/dev hosts may be plain http.
    const isLocal = /^(localhost|127\.|\[::1\]|\d{1,3}(\.\d{1,3}){3})(:\d+)?$/i.test(host);
    return `${isLocal ? "http" : "https"}://${host}`;
  } catch {
    // Called outside a request — build-time collection or static generation.
    return siteConfig.url;
  }
}
