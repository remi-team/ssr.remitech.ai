import { PAGE_META, type PageKey } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqSchema,
  newsArticleSchema,
  serviceSchema,
  stringifySchema,
  type Crumb,
  type FaqEntry,
  type NewsArticleInput,
  type SchemaNode,
  type ServiceInput,
} from "@/lib/structured-data";

/**
 * Server-rendered JSON-LD.
 *
 * QA BUG-02: these blocks MUST exist in the raw HTML. `next/script` defers
 * inline scripts out of the server document (they only survive inside the RSC
 * flight payload), so a plain `<script>` element rendered by a Server
 * Component is the only correct vehicle.
 */
export function JsonLd({ data }: { data: SchemaNode | SchemaNode[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringifySchema(data) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Breadcrumb trail derivation                                        */
/* ------------------------------------------------------------------ */

/** Canonical path → page label, so trails never drift from `PAGE_META`. */
const CRUMB_LABELS = new Map<string, string>();
for (const meta of Object.values(PAGE_META)) {
  CRUMB_LABELS.set(meta.path, crumbLabel(meta.en.title));
}
CRUMB_LABELS.set("/", "Home");

/**
 * Page title → breadcrumb label. Every `PAGE_META` title is `<name> — <tail>`,
 * so the trail carries the short navigation name only: "Cross-Border Payment —
 * Remi" → "Cross-Border Payment", "Solutions — 7*24 Stablecoin Exchange" →
 * "Solutions". Google truncates long crumb text in the SERP anyway.
 */
function crumbLabel(title: string): string {
  return title.split(/\s+[—–]\s+/)[0].trim();
}

/**
 * Build the navigation trail for a site-relative path by walking its prefixes
 * and resolving each against `PAGE_META`. Intermediate paths that are not
 * themselves pages (`/news/403`) simply contribute nothing.
 *
 * Google expects the trail to start at the site root, so `Home` is always the
 * first crumb — without it every top-level page collapsed to a single-entry
 * list and emitted no BreadcrumbList at all.
 */
export function buildCrumbTrail(path: string, leafLabel?: string): Crumb[] {
  const clean = path.replace(/\/+$/, "") || "/";
  const trail: Crumb[] = [{ name: "Home", path: "/" }];

  const segments = clean.split("/").filter(Boolean);
  let cursor = "";
  for (const segment of segments) {
    cursor += `/${segment}`;
    const label = CRUMB_LABELS.get(cursor);
    if (label) trail.push({ name: label, path: cursor });
  }

  const leafPath = clean;
  const leafLabel_ = leafLabel ?? CRUMB_LABELS.get(leafPath);
  if (leafLabel_ && trail[trail.length - 1].path !== leafPath) {
    trail.push({ name: leafLabel_, path: leafPath });
  } else if (leafLabel_ && trail.length > 0) {
    // De-dupe when the leaf resolved through the prefix walk already.
    trail[trail.length - 1] = { name: leafLabel_, path: leafPath };
  }

  // `item` is mandatory on every ListItem except the last, and Google warns
  // when the *current* page carries one — drop it from the tail.
  return trail.map((crumb, index) =>
    index === trail.length - 1 ? { ...crumb, path: "" } : crumb,
  );
}

/**
 * Per-page structured data. Rendered once per route; `Organization` +
 * `WebSite` live in the locale layout and are intentionally not duplicated.
 */
export function BreadcrumbJsonLd({
  path,
  label,
}: {
  /** Site-relative route of the current page, e.g. `/solutions/fx`. */
  path: string;
  /** Override for the leaf label (dynamic routes such as `/news/{id}`). */
  label?: string;
}) {
  const trail = buildCrumbTrail(path, label);
  if (trail.length < 2) return null;
  return <JsonLd data={breadcrumbSchema(trail)} />;
}

/**
 * Route-level shorthand: derives the crumb trail straight from `PAGE_META`,
 * so a page cannot advertise a breadcrumb path that drifts from its canonical
 * URL. `Organization` + `WebSite` already ship from the locale layout
 * (QA BUG-02), this covers the per-route entity graph.
 */
export function PageJsonLd({ page, label }: { page: PageKey; label?: string }) {
  return <BreadcrumbJsonLd path={PAGE_META[page].path} label={label} />;
}

export function ServiceJsonLd({ input }: { input: ServiceInput }) {
  return <JsonLd data={serviceSchema(input)} />;
}

/**
 * Broad service category per Solutions route — `ServiceType` is free text, and
 * naming the commercial category is what makes the node useful to a crawler.
 */
const SOLUTION_SERVICES: Partial<Record<PageKey, string>> = {
  solutionsCrossBorder: "Cross-border payment",
  solutionsFx: "FX & treasury",
  solutionsStablecoin: "Stablecoin issuance",
  solutionsRegtech: "Regulatory technology",
  solutionsCheque: "Digital cheque clearing",
  solutionsLc: "Tokenised trade finance",
};

/**
 * Solutions landing pages: BreadcrumbList + Service, both derived from
 * `PAGE_META` so the emitted name/description can never drift from the
 * `<title>`/`<meta description>` the same route renders (QA BUG-02).
 */
export function SolutionPageJsonLd({
  page,
  locale = "en",
}: {
  page: PageKey;
  locale?: string;
}) {
  const meta = PAGE_META[page];
  const category = SOLUTION_SERVICES[page];
  if (!meta || !category) return null;
  const copy = locale === "zh" ? meta.zh : meta.en;
  return (
    <>
      <BreadcrumbJsonLd path={meta.path} />
      <ServiceJsonLd
        input={{
          name: crumbLabel(copy.title),
          description: copy.description,
          path: meta.path,
          category,
        }}
      />
    </>
  );
}

export function NewsArticleJsonLd({ input }: { input: NewsArticleInput }) {
  return <JsonLd data={newsArticleSchema(input)} />;
}

export function FaqJsonLd({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null;
  return <JsonLd data={faqSchema(entries)} />;
}
