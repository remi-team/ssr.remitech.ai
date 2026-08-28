"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { newsService } from "@/services/client/client-news-service";
import type { NewsItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * NewsGrid — tabbed news listing migrated 1:1 from the legacy Vue
 * `views/news/index.vue`:
 *
 *  • Tabs: All / News / LinkedIn (orange underline on the active tab).
 *  • "all":  Press Releases & News (featured card + 2 stacked side cards)
 *            + VIEW ALL NEWS pill button, then the LinkedIn Updates band
 *            (centred header + 6 preview cards + VIEW ALL LINKEDIN button).
 *  • "news": full-width horizontal cards (image left, text right).
 *  • "linkedin": 3-column grid of LinkedIn cards.
 *
 * Field compatibility: website API payloads use `imageUrl` / `publishTime` /
 * `externalUrl`; legacy shapes use `cover` / `date` / `link`.
 */

type TabKey = "all" | "news" | "linkedin";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "news", label: "News" },
  { key: "linkedin", label: "LinkedIn" },
];

const PLACEHOLDER_IMAGE = "/images/news_banner_768.webp";

// ── helpers (parity with the Vue implementation) ──────────────────────────

function imageUrl(item: NewsItem): string | undefined {
  return (item.imageUrl as string) ?? item.cover;
}
function publishTime(item: NewsItem): string | undefined {
  return (item.publishTime as string) ?? item.date;
}
function externalUrl(item: NewsItem): string | undefined {
  return (item.externalUrl as string) ?? item.link;
}
function resolveImage(item: NewsItem): string {
  return imageUrl(item) || PLACEHOLDER_IMAGE;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function getTagColor(tag?: string): string {
  const map: Record<string, string> = {
    featured: "bg-[#FF8C2E] text-white",
    press: "bg-[#85714D]/10 text-[#85714D]",
    news: "bg-[#FF8C2E] text-white",
    event: "bg-[#8B7355] text-white",
  };
  return map[(tag || "news").toLowerCase()] || "bg-[#FF8C2E] text-white";
}

const LinkedInGlyph = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const clamp2: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};
const clamp3: React.CSSProperties = { ...clamp2, WebkitLineClamp: 3 };

// ── main component ────────────────────────────────────────────────────────

type NewsGridProps = {
  /**
   * Server-rendered initial data. When provided, the list is part of the
   * first HTML response (crawlable/indexable); the client effect below only
   * refreshes in the background when nothing was prefetched.
   */
  initialEvents?: NewsItem[];
  initialLinkedin?: NewsItem[];
};

export function NewsGrid({ initialEvents, initialLinkedin }: NewsGridProps) {
  const prefetched = Boolean(initialEvents || initialLinkedin);
  const [activeTab, setActiveTab] = React.useState<TabKey>("all");
  const [events, setEvents] = React.useState<NewsItem[]>(initialEvents ?? []);
  const [linkedin, setLinkedin] = React.useState<NewsItem[]>(initialLinkedin ?? []);
  const [loading, setLoading] = React.useState(!prefetched);

  const featuredGridRef = React.useRef<HTMLDivElement | null>(null);
  const linkedinPreviewRef = React.useRef<HTMLDivElement | null>(null);
  const newsListRef = React.useRef<HTMLDivElement | null>(null);
  const linkedinGridRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Server already supplied the data — nothing to fetch on the client.
    if (prefetched) return;
    let cancelled = false;
    (async () => {
      try {
        const [eventsRes, linkedinRes] = await Promise.all([
          newsService.getEvents({ current: 1, size: 20 }),
          newsService.getLinkedin({ current: 1, size: 20 }),
        ]);
        if (cancelled) return;
        setEvents(eventsRes.data?.records ?? []);
        setLinkedin(linkedinRes.data?.records ?? []);
      } catch (err) {
        console.error("News fetch failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [prefetched]);

  // Featured: first item flagged featured, fallback to first item.
  const featuredItem = React.useMemo(
    () => events.find((e) => e.type === "featured" || e.tag?.toLowerCase() === "featured") ?? events[0] ?? null,
    [events],
  );
  const sideNewsItems = React.useMemo(() => {
    if (!featuredItem) return [];
    return events.filter((e) => e !== featuredItem).slice(0, 2);
  }, [events, featuredItem]);
  // News tab: featured first, then the rest in order.
  const allNewsItems = React.useMemo(() => {
    const featured = events.find((e) => e.tag?.toLowerCase() === "featured");
    if (!featured) return events;
    return [featured, ...events.filter((e) => e !== featured)];
  }, [events]);
  const linkedinPreview = React.useMemo(() => linkedin.slice(0, 6), [linkedin]);

  // Scroll-reveal per visible grid.
  useCardReveal(featuredGridRef, !loading && activeTab === "all", 2);
  useCardReveal(linkedinPreviewRef, !loading && activeTab === "all", 3);
  useCardReveal(newsListRef, !loading && activeTab === "news", 1);
  useCardReveal(linkedinGridRef, !loading && activeTab === "linkedin", 3);

  return (
    <>
      {/* ── Tab navigation ── */}
      <section className="bg-[#f2efec] pt-[40px] pb-[48px] sm:pb-[64px] lg:pb-[70px]">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="mb-[48px] flex justify-center gap-[40px] sm:gap-[60px]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "inter-light relative cursor-pointer pb-[10px] text-[18px] font-medium transition-all duration-300 sm:text-[20px]",
                  activeTab === tab.key ? "text-[#FF8C2E]" : "text-[#2d2722] hover:text-[#FF8C2E]",
                )}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-1/2 h-[3px] w-[40px] -translate-x-1/2 rounded-full bg-[#FF8C2E]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TAB: ALL — Press Releases & News ── */}
      {activeTab === "all" && (
        <section className="bg-[#f2efec]">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="mb-[24px]">
              <h3 className="mb-[6px] text-[22px] font-bold text-[#2d2722]">Press Releases &amp; News</h3>
              <p className="inter-light text-[15px] text-[#86909C]">
                Latest announcements and industry updates from Remi Network
              </p>
            </div>

            {/* Featured + 2 stacked side cards */}
            <div
              ref={featuredGridRef}
              className="mb-[40px] grid grid-cols-1 gap-[24px] lg:grid-cols-[1.3fr_1fr]"
            >
              {loading ? (
                <>
                  <FeaturedSkeleton />
                  <div className="flex flex-col gap-[20px]">
                    <SideSkeleton />
                    <SideSkeleton />
                  </div>
                </>
              ) : (
                <>
                  {featuredItem && <FeaturedCard item={featuredItem} />}
                  <div className="flex flex-col gap-[20px]">
                    {sideNewsItems.map((item, idx) => (
                      <SideCard key={item.id ?? idx} item={item} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* View All News button → switches to the News tab */}
            <div className="mb-[60px] flex justify-center">
              <ViewAllPill label="VIEW ALL NEWS" onClick={() => setActiveTab("news")} />
            </div>
          </div>
        </section>
      )}

      {/* ── TAB: ALL — LinkedIn Updates band ── */}
      {activeTab === "all" && (
        <section className="bg-[#F7F5F3]">
          <div className="px-6 py-[48px] sm:px-8 sm:py-[56px] md:px-12 md:py-[64px] lg:px-16 lg:py-[80px] xl:py-[96px]">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-[40px] text-center sm:mb-[48px]">
                <h3 className="mb-[12px] text-[24px] font-bold text-[#2d2722] sm:text-[28px]">LinkedIn Updates</h3>
                <p className="inter-light mb-[16px] text-[15px] text-[#86909C] sm:text-[16px]">
                  Follow our journey and connect with us on LinkedIn for real-time updates
                </p>
                <div className="flex justify-center">
                  <LinkedInGlyph className="h-[32px] w-[32px] text-[#0077B5]" />
                </div>
              </div>

              <div ref={linkedinPreviewRef} className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <LinkedInSkeleton key={i} />)
                  : linkedinPreview.map((card, idx) => <LinkedInCard key={card.id ?? idx} card={card} />)}
              </div>

              <div className="mt-[40px] flex justify-center">
                <ViewAllPill label="VIEW ALL LINKEDIN" onClick={() => setActiveTab("linkedin")} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TAB: NEWS / LINKEDIN ── */}
      {activeTab !== "all" && (
        <section className="bg-[#f2efec] pb-[48px] sm:pb-[64px] lg:pb-[80px]">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8 md:px-12 lg:px-16">
            {activeTab === "news" && (
              <div ref={newsListRef} className="space-y-[20px]">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
                  : allNewsItems.map((item, idx) => <RowCard key={item.id ?? idx} item={item} />)}
              </div>
            )}
            {activeTab === "linkedin" && (
              <div ref={linkedinGridRef} className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <LinkedInSkeleton key={i} />)
                  : linkedin.map((card, idx) => <LinkedInCard key={card.id ?? idx} card={card} />)}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

// ── VIEW ALL pill button ──────────────────────────────────────────────────

function ViewAllPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inter-light group inline-flex cursor-pointer items-center gap-[8px] rounded-full border-2 border-[#FF8C2E] px-[28px] py-[12px] text-[14px] font-bold text-[#FF8C2E] transition-all duration-300 hover:bg-[#FF8C2E] hover:text-white"
    >
      {label}
      <span className="relative ml-[8px] h-[32px] w-[32px]">
        <img
          src="/images/icon-news-more.png"
          alt="News more icon"
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src="/images/icon-news-more_hover.png"
          alt="News more hover icon"
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>
    </button>
  );
}

// ── Cards ─────────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag?: string }) {
  if (!tag) return null;
  return (
    <span
      className={cn(
        "inter-light inline-block rounded-sm px-[10px] py-[3px] text-[11px] uppercase tracking-[1.5px]",
        getTagColor(tag),
      )}
    >
      {tag}
    </span>
  );
}

function DateStamp({ value, className }: { value?: string; className?: string }) {
  const text = formatDate(value);
  if (!text) return null;
  return (
    <span className={cn("inter-light flex items-center gap-[4px] text-[13px] text-[#999]", className)}>
      <img src="/images/icon-date.png" alt="Date" className="h-[24px] w-[24px] object-contain" />
      {text}
    </span>
  );
}

/** Left primary card: cover image + inner white panel. */
function FeaturedCard({ item }: { item: NewsItem }) {
  return (
    <div className="card-hidden flex flex-col overflow-hidden rounded-lg bg-[#FFF5EE] shadow-[#F1E3DA] transition-shadow duration-300 hover:shadow-lg">
      <div className="h-[220px] w-full overflow-hidden bg-[#f0ebe6] sm:h-[280px] lg:h-[320px]">
        <img src={resolveImage(item)} alt={item.title} decoding="async" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-[12px]">
        <div className="mb-[12px] flex items-center gap-[10px]">
          <TagBadge tag={item.tag} />
          <DateStamp value={publishTime(item)} />
        </div>
        <div className="flex-1 rounded-[8px] bg-white p-[12px]">
          <h2 className="mb-[12px] text-[18px] font-bold leading-[1.3] text-[#29221D] lg:text-[20px]">
            {item.title}
          </h2>
          {item.summary && (
            <p className="inter-light mb-[20px] text-[14px] leading-[1.7] text-[#86909C] sm:text-[15px]" style={clamp3}>
              {item.summary}
            </p>
          )}
          <div className="mt-auto pb-[12px] pt-[4px]">
            <Link
              href={`/news/${item.id}`}
              className="inter-light inline-flex items-center gap-[6px] text-[14px] font-bold text-[#FF8C2E] transition-colors hover:text-[#e07820]"
            >
              Read more <span>&rsaquo;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Right stacked text-only cards. */
function SideCard({ item }: { item: NewsItem }) {
  const featured = item.type === "featured";
  return (
    <div
      className={cn(
        "card-hidden flex flex-1 flex-col overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-lg",
        featured ? "border-[#FFD5C0] bg-[#FFF5EE]" : "border-[#e5e7eb] bg-white",
        "shadow-[#F1E3DA]",
      )}
    >
      <div className="flex flex-1 flex-col px-[18px] pt-[18px] sm:px-[22px] sm:pt-[22px]">
        <div className="mb-[10px] flex items-center gap-[10px]">
          <TagBadge tag={item.tag} />
          <DateStamp value={publishTime(item)} />
        </div>
        <h3 className="mb-[8px] text-[16px] font-bold leading-[1.4] text-[#2d2722] sm:text-[18px]" style={clamp2}>
          {item.title}
        </h3>
        {item.summary && (
          <p className="inter-light mb-[14px] flex-1 text-[13px] leading-[1.6] text-[#86909C] sm:text-[14px]" style={clamp3}>
            {item.summary}
          </p>
        )}
        <div className="mt-auto pb-[18px] pt-[4px] sm:pb-[22px]">
          <Link
            href={`/news/${item.id}`}
            className="inter-light inline-flex items-center gap-[6px] text-[14px] font-bold text-[#FF8C2E] transition-colors hover:text-[#e07820]"
          >
            Read more <span>&rsaquo;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** News tab: horizontal card (image left, text right). */
function RowCard({ item }: { item: NewsItem }) {
  return (
    <div className="card-hidden flex flex-col overflow-hidden rounded-lg bg-white shadow-[#F1E3DA] transition-shadow duration-300 hover:shadow-lg sm:flex-row sm:items-start">
      <div className="shrink-0 bg-[#f0ebe6] sm:w-[373px]" style={{ aspectRatio: "16/9" }}>
        <img src={resolveImage(item)} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col p-[20px] sm:p-[24px]">
        <div className="mb-[12px] h-[68px]">
          <div className="mb-[8px] flex items-center gap-[10px]">
            <TagBadge tag={item.tag} />
            <DateStamp value={publishTime(item)} className="text-[13px]" />
          </div>
          <h3 className="text-[18px] leading-[1.4] text-[#2d2722]" style={clamp2}>
            {item.title}
          </h3>
        </div>
        <div className="mb-[16px] h-[44px]">
          <p className="inter-light text-[14px] leading-[1.6] text-[#86909C]" style={clamp2}>
            {item.summary}
          </p>
        </div>
        <div className="h-[22px]">
          <Link
            href={`/news/${item.id}`}
            className="inter-light inline-flex items-center gap-[6px] text-[14px] font-bold text-[#2d2722] transition-colors hover:text-[#FF8C2E]"
          >
            Read more <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** LinkedIn card (preview + linkedin tab). */
function LinkedInCard({ card }: { card: NewsItem }) {
  const href = externalUrl(card);
  return (
    <div className="card-hidden flex flex-col overflow-hidden rounded-lg bg-white shadow-[#F1E3DA] transition-shadow duration-300 hover:shadow-lg">
      {imageUrl(card) && (
        <div className="h-[180px] w-full overflow-hidden sm:h-[200px]">
          <img src={imageUrl(card)} alt={card.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col px-[18px] pt-[18px] sm:px-[22px] sm:pt-[22px]">
        <h4 className="mb-[10px] text-[16px] leading-[1.4] text-[#2d2722]" style={clamp2}>
          {card.title}
        </h4>
        <div className="mb-[14px] flex items-center gap-[12px]">
          <DateStamp value={publishTime(card)} className="text-[12px] text-[#aaa]" />
          <span className="inline-flex items-center gap-[4px] rounded-full bg-[#E8F0FE] px-[8px] py-[2px] text-[11px] font-medium text-[#0077B5]">
            <LinkedInGlyph className="h-[12px] w-[12px]" />
            LinkedIn
          </span>
        </div>
        <div className="mt-auto pb-[18px] pt-[4px] sm:pb-[22px]">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="inter-light inline-flex items-center gap-[6px] text-[12px] text-[#FF8C2E] transition-colors hover:text-[#e07820]"
            >
              View More <span>&rsaquo;</span>
            </a>
          ) : (
            <Link
              href={`/news/${card.id}`}
              className="inter-light inline-flex items-center gap-[6px] text-[12px] text-[#FF8C2E] transition-colors hover:text-[#e07820]"
            >
              View More <span>&rsaquo;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────

function FeaturedSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-[#FFF5EE]">
      <div className="h-[320px] w-full animate-pulse bg-[#86909C]/10" />
      <div className="p-[12px]">
        <div className="h-[200px] animate-pulse rounded-[8px] bg-white" />
      </div>
    </div>
  );
}
function SideSkeleton() {
  return (
    <div className="flex-1 rounded-lg bg-white p-[22px]">
      <div className="h-4 w-1/3 animate-pulse rounded bg-[#86909C]/15" />
      <div className="mt-3 h-5 w-full animate-pulse rounded bg-[#86909C]/20" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#86909C]/15" />
    </div>
  );
}
function RowSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-lg bg-white">
      <div className="aspect-video w-[373px] shrink-0 animate-pulse bg-[#86909C]/10" />
      <div className="flex-1 p-6">
        <div className="h-4 w-1/3 animate-pulse rounded bg-[#86909C]/15" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-[#86909C]/20" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#86909C]/15" />
      </div>
    </div>
  );
}
function LinkedInSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="h-[200px] w-full animate-pulse bg-[#86909C]/10" />
      <div className="p-[22px]">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#86909C]/20" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[#86909C]/15" />
      </div>
    </div>
  );
}

// ── Scroll-reveal hook (IntersectionObserver, dependency-free) ────────────

function useCardReveal(
  gridRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  cols: number,
) {
  React.useEffect(() => {
    if (!enabled) return;
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".card-hidden"));
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const idx = cards.indexOf(entry.target);
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const delay = (row * cols + col) * (cols === 2 ? 80 : 60);
            target.style.transitionDelay = `${delay}ms`;
            target.classList.remove("card-hidden");
            target.classList.add("card-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [enabled, gridRef, cols]);
}
