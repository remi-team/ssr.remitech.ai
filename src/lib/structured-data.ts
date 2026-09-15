/**
 * schema.org structured-data factories.
 *
 * Every payload is rendered server-side through `<JsonLd>` (see
 * `src/components/seo/json-ld.tsx`) so it lands in the raw HTML document —
 * non-JS crawlers (Baidu, Yandex, social scrapers) and Google's first
 * indexing pass never execute JavaScript.
 *
 * QA BUG-02: `next/script` does NOT emit an SSR `<script>` element for inline
 * JSON-LD (it only survives inside the RSC flight payload), which is why the
 * Organization block that used to live in the locale layout was invisible to
 * `view-source`. Plain `<script>` in a Server Component is the documented
 * Next.js approach.
 *
 * All node ids are absolute and stable so types can cross-reference each other
 * (`publisher: { "@id": ".../#organization" }`) instead of duplicating data.
 */

import { siteConfig } from "@/config/site";

export type SchemaNode = Record<string, unknown>;

/** Resolve a site-relative path against the deployment origin. */
export function absoluteUrl(path: string): string {
  if (!path) return siteConfig.url;
  // Backend cover art already arrives as an absolute S3/HTTPS URL.
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, siteConfig.url).toString();
}

/**
 * Serialise a schema.org node for embedding inside `<script type="application/ld+json">`.
 *
 * `JSON.stringify` alone is not safe there: a backend-supplied string containing
 * `</script>` would terminate the element early and turn the remainder into
 * executable markup. `<`, `>` and `&` (plus the line separators JSONP hosts
 * choke on) are escaped to their \uXXXX forms, which is still valid JSON and is
 * decoded back by the crawler's JSON parser.
 */
export function stringifySchema(data: SchemaNode | SchemaNode[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

/** Organization — the site-wide entity every other node references. */
export function organizationSchema(): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    description:
      "Remi provides regulated stablecoin infrastructure for financial institutions — orchestrating cross-border payment, FX & treasury, RegTech and tokenised trade finance.",
    sameAs: [siteConfig.social.x, siteConfig.social.linkedin],
    contactPoint: siteConfig.contacts.map((c) => ({
      "@type": "ContactPoint",
      contactType: "customer service",
      email: c.email,
      availableLanguage: ["English"],
    })),
  };
}

/** WebSite — declares the parsed entity behind the origin. */
export function websiteSchema(): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export type Crumb = { name: string; path: string };

/** BreadcrumbList — mirrors the visible navigation trail of the page. */
export function breadcrumbSchema(trail: Crumb[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      // `item` is required on every entry except the current page.
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

export interface ServiceInput {
  name: string;
  description: string;
  /** Site-relative route the service is described on. */
  path: string;
  /** Broad category, e.g. "Cross-border payment". */
  category?: string;
}

/**
 * Service — one per Solutions page. Lets Google associate the landing copy
 * with a commercial service offered by the Organization.
 */
export function serviceSchema(input: ServiceInput): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(input.path)}#service`,
    name: input.name,
    serviceType: input.category ?? input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Place", name: "Global" },
  };
}

export interface NewsArticleInput {
  headline: string;
  description?: string;
  /** Raw backend timestamp (`"2026-06-16 08:00:00"`) or any Date-parsable string. */
  publishedAt?: string;
  modifiedAt?: string;
  /** Site-relative or absolute cover image URL. */
  image?: string;
  /** Site-relative article route, e.g. `/news/403`. */
  path: string;
}

/**
 * NewsArticle — emitted for every `/news/{id}` route (QA BUG-03).
 *
 * `datePublished` must be ISO 8601; the website API returns naive
 * `"YYYY-MM-DD HH:mm:ss"` strings, which Google's Rich Results test rejects.
 * The content team publishes from Singapore (UTC+8), so naive values are
 * interpreted as +08:00 rather than silently shifted to UTC.
 */
export function newsArticleSchema(input: NewsArticleInput): SchemaNode {
  const url = absoluteUrl(input.path);
  const node: SchemaNode = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: input.headline,
    description: input.description ?? "",
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    url,
  };

  const datePublished = toIso8601(input.publishedAt);
  if (datePublished) node.datePublished = datePublished;
  const dateModified = toIso8601(input.modifiedAt) ?? datePublished;
  if (dateModified) node.dateModified = dateModified;
  if (input.image) node.image = absoluteUrl(input.image);

  return node;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** FAQPage — `/resources` accordion content. */
export function faqSchema(entries: FaqEntry[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Date normalisation                                                 */
/* ------------------------------------------------------------------ */

/** `"2026-06-16 08:00:00"` — the website API's naive timestamp shape. */
const NAIVE_RE = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/;

/**
 * Coerce a backend timestamp into an ISO 8601 string, or `undefined` when the
 * value is missing/unparsable (so the property is omitted rather than emitted
 * as `undefined`, which would invalidate the whole node).
 */
export function toIso8601(value?: string | null): string | undefined {
  if (!value) return undefined;
  const raw = String(value).trim();

  const naive = NAIVE_RE.exec(raw);
  if (naive) {
    const [, y, mo, d, h, mi, s] = naive;
    return `${y}-${mo}-${d}T${h}:${mi}:${s ?? "00"}+08:00`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}
