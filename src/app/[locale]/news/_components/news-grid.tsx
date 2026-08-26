"use client";

import * as React from "react";
import { newsService } from "@/services/client/client-news-service";
import type { NewsItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * NewsGrid — two-part news listing for the News page.
 *
 *  1. Press Releases & News — 2-column grid with tag badges + Read More.
 *  2. Social Media & Events — 3-column grid with cover images + View More.
 *
 * Both grids use IntersectionObserver scroll-reveal (card-hidden → card-visible
 * with staggered transitionDelay), matching the legacy GSAP impl but
 * dependency-free. Data is fetched client-side via the BFF news service.
 */
export function NewsGrid() {
  const [press, setPress] = React.useState<NewsItem[]>([]);
  const [social, setSocial] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const pressGridRef = React.useRef<HTMLDivElement | null>(null);
  const socialGridRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [eventsRes, linkedinRes] = await Promise.all([
          newsService.getEvents({ current: 1, size: 20 }),
          newsService.getLinkedin({ current: 1, size: 20 }),
        ]);
        if (cancelled) return;
        setPress(eventsRes.data?.records ?? []);
        setSocial(linkedinRes.data?.records ?? []);
      } catch (err) {
        console.error("News fetch failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-reveal animation for press cards.
  useCardReveal(pressGridRef, !loading, 2);
  // Scroll-reveal animation for social cards.
  useCardReveal(socialGridRef, !loading, 3);

  return (
    <section className="bg-[#f2efec] pb-12 pt-[66px] sm:pb-14 md:pb-16 lg:pb-20 xl:pb-24">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Section 1: Press Releases & News */}
        <div data-scroll="section-title-1" className="mb-8">
          <h3 className="mb-3 text-[20px] font-medium text-[#2d2722]">Press Releases &amp; News</h3>
          <p className="text-[16px] text-[#86909C]">
            Latest announcements and industry updates from Remi Network
          </p>
        </div>

        <div
          ref={pressGridRef}
          data-scroll="press-release"
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:gap-7 xl:gap-8"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <PressSkeleton key={i} />)
            : press.map((card) => <PressCard key={card.id} card={card} />)}
        </div>

        {/* Divider */}
        <div data-scroll="divider" className="my-[30px] h-[2px] scale-y-50 bg-[#EBE8E5]" />

        {/* Section 2: Social Media & Events */}
        <div data-scroll="section-title-2" className="mb-8">
          <h3 className="mb-3 text-[20px] font-medium text-[#2d2722]">Social Media &amp; Events</h3>
          <p className="text-[16px] text-[#86909C]">Follow us on social media and join our global events</p>
        </div>

        <div
          ref={socialGridRef}
          data-scroll="linkedin-cards"
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7 xl:gap-8"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SocialSkeleton key={i} />)
            : social.map((card) => <SocialCard key={card.id} card={card} />)}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

function PressCard({ card }: { card: NewsItem }) {
  return (
    <div className="card-hidden relative flex h-full flex-col overflow-hidden rounded bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-[#F1E3DA]">
      {card.tag && (
        <span
          className={cn(
            "absolute right-0 top-0 rounded-bl-[2px] rounded-tr-[2px] px-2.5 py-1 text-[12px] uppercase tracking-wide text-white",
            card.tag === "PRESS" ? "bg-black" : "bg-[#FF8C2E]",
          )}
        >
          {card.tag}
        </span>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
        <h3
          className="text-[18px] text-[#29221D]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.title}
        </h3>
        <p
          className="my-8 text-[16px] text-[#86909C]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.summary}
        </p>
        <a
          href={card.link || "/news"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex h-[32px] w-full items-center justify-center rounded border border-[#FF6900] bg-[#FF6900] px-5 py-2.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#FF6900]/40 sm:min-h-[48px] sm:py-3 sm:text-[14px]"
        >
          Read More
        </a>
      </div>
    </div>
  );
}

function SocialCard({ card }: { card: NewsItem }) {
  return (
    <div className="card-hidden relative flex h-full flex-col overflow-hidden rounded bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-[#F1E3DA]">
      {card.cover && (
        <div className="h-[180px] w-full overflow-hidden sm:h-[200px] md:h-[220px] lg:h-[200px] xl:h-[220px]">
          <img
            src={card.cover}
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
        <h3
          className="text-[18px] text-[#29221D]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.title}
        </h3>
        <p
          className="my-8 text-[16px] text-[#86909C]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.summary}
        </p>
        <a
          href={card.link || "/news"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex h-[32px] w-full items-center justify-center rounded border border-[#FF6900] bg-[#FF6900] px-5 py-2.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#FF6900]/40 sm:min-h-[48px] sm:py-3 sm:text-[14px]"
        >
          View More
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function PressSkeleton() {
  return (
    <div className="flex h-full flex-col rounded bg-white p-7">
      <div className="h-5 w-3/4 animate-pulse rounded bg-[#86909C]/20" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#86909C]/15" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[#86909C]/15" />
      <div className="mt-8 h-10 w-full animate-pulse rounded bg-[#86909C]/15" />
    </div>
  );
}

function SocialSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded bg-white">
      <div className="h-[200px] w-full animate-pulse bg-[#86909C]/10" />
      <div className="flex flex-1 flex-col p-7">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#86909C]/20" />
        <div className="mt-8 h-4 w-full animate-pulse rounded bg-[#86909C]/15" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-[#86909C]/15" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll-reveal hook (IntersectionObserver, dependency-free)
// ---------------------------------------------------------------------------

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
            const idx = cards.indexOf(entry.target);
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const delay = (row * cols + col) * (cols === 2 ? 80 : 60);
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.remove("card-hidden");
            entry.target.classList.add("card-visible");
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
