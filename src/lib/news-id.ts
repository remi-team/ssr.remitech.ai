/**
 * Article-id validation shared by the `/news/{id}` route, the sitemap and
 * every listing that builds an article href.
 *
 * Why this exists (QA BUG-04): the `content/linkedin/page` endpoint returns
 * records with **no `id` field at all** — they are external posts whose only
 * link is `externalUrl`. Any listing that interpolates `` `/news/${item.id}` ``
 * therefore produces `/news/undefined`, and a loose `String(a.id) === id`
 * comparison resolved that slug onto the first id-less record, serving a real
 * article with HTTP 200 (a soft-404 that Google happily deindexes you for).
 */

const ARTICLE_ID_RE = /^[0-9A-Za-z_-]{1,64}$/;

/** Slugs that can only ever come from an unguarded template interpolation. */
const RESERVED_SLUGS = new Set(["undefined", "null", "nan", "index"]);

/** Is `id` a structurally plausible article id? */
export function isValidArticleId(id: string | number | null | undefined): id is string | number {
  if (id === null || id === undefined) return false;
  const raw = String(id).trim();
  if (!raw) return false;
  if (RESERVED_SLUGS.has(raw.toLowerCase())) return false;
  return ARTICLE_ID_RE.test(raw);
}

/**
 * Article route for a listing card, or `null` when the record is not linkable
 * (id-less LinkedIn posts must link out via `externalUrl` instead).
 */
export function articlePathFor(item: { id?: string | number | null }): string | null {
  return isValidArticleId(item.id) ? `/news/${item.id}` : null;
}
