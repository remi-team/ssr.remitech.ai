"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { newsService } from "@/services/client/client-news-service";
import type { NewsItem } from "@/lib/api/types";
import { IMAGES } from "./images";

/** Website API payloads use `imageUrl` / `externalUrl`; legacy `cover` / `link` kept as fallbacks. */
const coverOf = (item: NewsItem) => (item.imageUrl as string | undefined) ?? item.cover;
const hrefOf = (item: NewsItem) => (item.externalUrl as string | undefined) ?? item.link;

/**
 * NewsSection — migrated from the legacy "News section".
 *
 * Two parts:
 *  1. Featured press news (vertical list with title + summary + Read More).
 *  2. LinkedIn news grid (3 cards with image + title + summary + View More).
 *
 * Data is fetched client-side via the BFF news service (React Query + Suspense
 * would be ideal, but a simple useEffect keeps this section self-contained).
 */
export function NewsSection() {
  const [featured, setFeatured] = React.useState<NewsItem[]>([]);
  const [linkedin, setLinkedin] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [homeRes, linkRes] = await Promise.all([
          newsService.getHomepage({ current: 1, size: 3 }),
          newsService.getLinkedin({ current: 1, size: 3 }),
        ]);
        if (cancelled) return;
        setFeatured(homeRes.data?.records ?? []);
        setLinkedin(linkRes.data?.records ?? []);
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

  return (
    <section data-scroll="news" className="bg-[#f2efec] pb-8 pt-[60px] lg:pb-12 lg:pt-[110px]">
      {/* Featured press */}
      <div className="relative mx-auto max-w-[1024px] px-6 lg:px-[123px]">
        <div className="flex h-[60px] w-[56px] items-center justify-center md:h-[80px] md:w-[76px]">
          <img
            src={IMAGES.news.quote}
            alt="Quote icon"
            className="h-full w-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        </div>
        <div className="flex flex-col gap-5 pt-6 md:gap-8 md:pt-9">
          {loading ? (
            <FeaturedSkeleton />
          ) : (
            featured.map((card, i) => {
              const href = hrefOf(card) || "/#news";
              const external = /^https?:\/\//.test(href);
              return (
              <div key={i} className="max-w-[680px]">
                <h2 className="pt-4 text-left text-[20px] font-medium text-[#29221D] md:text-[28px] lg:text-[32px]">
                  {card.title}
                </h2>
                <p className="pb-3 pt-4 text-left text-[16px] text-[#86909C] md:pb-4 md:pt-6">
                  {card.summary}
                </p>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-block rounded-full border border-[#86909C] px-8 py-2 text-left text-[14px] text-[#86909C] transition-colors hover:bg-[#FF6900] hover:text-white hover:border-[#FF6900] md:px-12 md:py-2.5 md:text-[16px]"
                >
                  Read More
                </a>
              </div>
              );
            })
          )}
        </div>
      </div>

      {/* LinkedIn news grid */}
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-[123px]">
        <div className="mx-auto grid max-w-[1104px] grid-cols-1 gap-5 pt-10 md:grid-cols-2 md:pt-[66px] lg:grid-cols-3 lg:gap-[30px]">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : linkedin.map((card, i) => {
                const cover = coverOf(card);
                const href = hrefOf(card) || "/#news";
                const external = /^https?:\/\//.test(href);
                return (
                <div
                  key={i}
                  className="relative flex h-full flex-col overflow-hidden rounded bg-white transition-shadow duration-300 hover:shadow-lg hover:shadow-[#F1E3DA]"
                >
                  {cover && (
                    <div className="h-[160px] w-full overflow-hidden md:h-[180px] lg:h-[190px]">
                      <img
                        src={cover}
                        alt={card.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
                      className="my-5 text-[14px] text-[#86909C] md:my-8"
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
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mx-auto inline-flex w-full items-center justify-center rounded border border-[#FF6900] bg-white px-5 py-2.5 text-[13px] font-medium text-[#FF6900] transition-colors duration-200 hover:bg-[#FF6B00] hover:text-white sm:min-h-[48px] sm:py-3 sm:text-[14px] lg:max-w-[210px]"
                    >
                      View More
                    </a>
                  </div>
                </div>
                );
              })}
        </div>
      </div>

      {/* View all */}
      <div className="relative mx-auto max-w-[1024px] px-6 lg:px-[123px]">
        <div className="pb-6 pt-12 text-center md:pb-12">
          <a
            href="/#news"
            className="group mx-auto flex max-w-[320px] items-center justify-center rounded-[62px] border border-[#FF6900] px-6 py-3 transition-all duration-300 hover:bg-[#FF6900]"
          >
            <span className="text-[16px] text-[#FF6900] transition-colors duration-300 group-hover:text-white md:text-[20px]">
              View All News &amp; Events
            </span>
            <ArrowRight className="ml-2 h-5 w-5 text-[#FF6900] transition-colors duration-300 group-hover:text-white" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="max-w-[680px]">
      <div className="pt-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-[#86909C]/20" />
        <div className="mt-2 h-8 w-1/2 animate-pulse rounded bg-[#86909C]/20" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded bg-white">
      <div className="h-[180px] w-full animate-pulse bg-[#86909C]/10" />
      <div className="flex flex-1 flex-col p-6">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#86909C]/20" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#86909C]/15" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-[#86909C]/15" />
      </div>
    </div>
  );
}
