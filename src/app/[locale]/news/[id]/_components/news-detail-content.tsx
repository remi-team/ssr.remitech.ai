"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Cta } from "@/components/cta";
import { renderEditorJsContent } from "@/lib/editorjs-renderer";
import type { NewsItem } from "@/lib/api/types";
import { newsService } from "@/services/client/client-news-service";
import { NEWS_IMAGES } from "../../_components/images";
import "./article-content.css";

/** Legacy extra fields that may accompany an article from the website API CMS. */
type ArticleEx = NewsItem & {
  category?: string;
  imageUrl?: string;
  externalSource?: string;
  externalUrl?: string;
  newsSource?: string;
  publishTime?: string;
};

/**
 * NewsDetailContent — migrated from the legacy Vue `newsDetail/index.vue`.
 *
 * Sections: Hero (tag / title / date / breadcrumb) → article body
 * (Editor.js rendered) → actions (back + LinkedIn share) → Continue Reading
 * (3 related cards) → CTA.
 */
export function NewsDetailContent({ article }: { article: NewsItem }) {
  const t = useTranslations("NewsDetail");
  const a = article as ArticleEx;

  const [related, setRelated] = React.useState<NewsItem[]>([]);

  // Rendered article body (Editor.js JSON or raw HTML).
  const renderedContent = React.useMemo(
    () => renderEditorJsContent(a.content),
    [a.content],
  );

  // Related articles: events list excluding the current article, first 3.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await newsService.getEvents({ current: 1, size: 20 });
        if (cancelled) return;
        setRelated(
          (res.data?.records ?? [])
            .filter((item) => String(item.id) !== String(a.id))
            .slice(0, 3),
        );
      } catch (err) {
        console.error("Related news fetch failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [a.id]);

  function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "width=600,height=500,scrollbars=yes",
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <picture>
            <source
              media="(min-width:1536px)"
              srcSet={`${NEWS_IMAGES.hero.image1536}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image1536}@2x_compressed.webp 2x`}
              type="image/webp"
            />
            <source
              media="(min-width:1536px)"
              srcSet={`${NEWS_IMAGES.hero.image1536}@1x_compressed.jpg 1x, ${NEWS_IMAGES.hero.image1536}@2x_compressed.jpg 2x`}
              type="image/jpeg"
            />
            <source
              media="(min-width:1280px)"
              srcSet={`${NEWS_IMAGES.hero.image1280}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image1280}@2x_compressed.webp 2x`}
              type="image/webp"
            />
            <source
              media="(min-width:1280px)"
              srcSet={`${NEWS_IMAGES.hero.image1280}@1x_compressed.jpg 1x, ${NEWS_IMAGES.hero.image1280}@2x_compressed.jpg 2x`}
              type="image/jpeg"
            />
            <source
              media="(min-width:768px)"
              srcSet={`${NEWS_IMAGES.hero.image768}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image768}@2x_compressed.webp 2x`}
              type="image/webp"
            />
            <source
              media="(min-width:768px)"
              srcSet={`${NEWS_IMAGES.hero.image768}@1x_compressed.jpg 1x, ${NEWS_IMAGES.hero.image768}@2x_compressed.jpg 2x`}
              type="image/jpeg"
            />
            <source
              srcSet={`${NEWS_IMAGES.hero.image640}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image640}@2x_compressed.webp 2x`}
              type="image/webp"
            />
            <img
              src={`${NEWS_IMAGES.hero.image640}@1x_compressed.webp`}
              srcSet={`${NEWS_IMAGES.hero.image640}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image640}@2x_compressed.webp 2x`}
              alt="News"
              className="h-full w-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex pb-[48px] pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[200px]">
          <div className="mx-auto w-full max-w-[1536px] px-[24px] sm:px-[32px] md:px-[48px] lg:px-[64px]">
            {a.tag && (
              <span
                className={[
                  "mb-[20px] inline-block px-[14px] py-[5px] text-[11px] font-light uppercase tracking-wide text-white",
                  a.tag === "PRESS" ? "bg-black" : "bg-[#FF8C2E]",
                ].join(" ")}
              >
                {a.tag}
              </span>
            )}
            <h1 className="mb-[15px] max-w-[900px] text-[24px] font-light leading-[1.3] text-white sm:text-[28px] md:text-[36px] lg:text-[42px]">
              {a.title}
            </h1>
            <p className="mb-[25px] text-[13px] font-light text-white/55 sm:text-[14px]">
              {a.date}
            </p>
            {/* Breadcrumb */}
            <div className="border-t border-white/10 pt-[20px] text-[13px] text-white/50">
              <Link href="/" className="text-[13px] text-white/60 underline hover:text-white">
                {t("breadcrumbHome")}
              </Link>
              <span className="mx-[8px] text-white/40">&gt;</span>
              <Link href="/news" className="text-[13px] text-white/60 underline hover:text-white">
                {t("breadcrumbNews")}
              </Link>
              <span className="mx-[8px] text-white/40">&gt;</span>
              <span className="text-white/50">{a.category || t("breadcrumbArticle")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-[60px] sm:py-[80px]">
        <div className="mx-auto px-[20px] lg:max-w-[1024px]">
          {a.imageUrl && (
            <div
              className="mb-[40px] w-full overflow-hidden rounded-[6px]"
              style={{ aspectRatio: "16/9" }}
            >
              <img src={a.imageUrl} alt={a.title} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Also featured on */}
          {a.externalSource && (
            <div className="mb-[30px] pb-[10px] text-center">
              <div className="mx-auto mb-[20px] h-[1px] w-[30px] bg-[#ddd]" />
              <p className="mb-[10px] text-[12px] uppercase tracking-[2px] text-[#999]">
                {t("alsoFeaturedOn")}
              </p>
              <a
                href={a.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-[#86909C] transition-colors hover:text-[#FF8C2E]"
              >
                {a.externalSource} <span className="text-[12px]">&#8599;</span>
              </a>
            </div>
          )}

          {/* Content rendered from Editor.js JSON / HTML — the renderer escapes
              plain-text fields; raw/embed blocks are trusted CMS output (parity
              with the legacy v-html behaviour). */}
          {renderedContent ? (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />
          ) : a.summary ? (
            <div className="article-content">
              <p>{a.summary}</p>
            </div>
          ) : null}

          {/* Also Featured On (bottom) */}
          {a.externalUrl ? (
            <div className="mt-[48px] text-center">
              <div className="mx-auto mb-[20px] h-[1px] w-[30px] bg-[#ddd]" />
              <p className="mb-[12px] text-[12px] uppercase tracking-[3px] text-[#ccc]">
                {t("alsoFeaturedOn")}
              </p>
              <a
                href={a.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[6px] text-[20px] text-[#2d2722] transition-colors hover:text-[#FF8C2E]"
              >
                {a.newsSource}
                <span className="text-[16px]">&#8599;</span>
              </a>
            </div>
          ) : null}
        </div>
      </section>

      {/* Article Actions */}
      <div className="mx-auto flex max-w-[800px] items-center justify-between border-t border-[#eee] px-[20px] py-[25px]">
        <Link
          href="/news"
          className="text-[14px] font-medium text-[#2d2722] transition-colors hover:text-[#FF8C2E]"
        >
          <span className="mr-[6px]">&larr;</span> {t("backToNews")}
        </Link>
        <button
          type="button"
          onClick={shareOnLinkedIn}
          className="inline-flex cursor-pointer items-center gap-[8px] border border-[#ddd] px-[18px] py-[8px] text-[13px] font-bold text-[#0077B5] transition-all hover:border-[#0077B5] hover:bg-[#f0f7fb]"
        >
          <svg className="h-[16px] w-[16px] fill-[#0077B5]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          {t("share")}
        </button>
      </div>

      {/* Continue Reading */}
      <section className="bg-[#f2efec] py-[60px] sm:py-[72px] lg:py-[80px]">
        <div className="mx-auto max-w-[1200px] px-[24px] sm:px-[32px] md:px-[48px] lg:px-[64px]">
          <h2 className="mb-[40px] text-center text-[28px] font-medium text-[#2d2722] sm:mb-[48px]">
            {t("continueReading")}
          </h2>
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
            {related.map((card) => (
              <RelatedCard key={card.id} card={card as ArticleEx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Cta>
        <h2 className="mx-auto mb-[24px] max-w-[860px] text-[24px] font-light leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          {t("ctaTitle")}
        </h2>
      </Cta>
    </>
  );
}

// ---------------------------------------------------------------------------
// Related card
// ---------------------------------------------------------------------------

function RelatedCard({ card }: { card: ArticleEx }) {
  const t = useTranslations("NewsDetail");

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-[#F1E3DA] transition-shadow duration-300 hover:shadow-lg">
      <div className="h-[200px] w-full rounded-t-lg bg-[#f0ebe6]">
        {card.imageUrl && (
          <img src={card.imageUrl} alt={card.title} className="h-full w-full object-contain" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-[20px] sm:p-[24px]">
        {/* Title section: fixed height */}
        <div className="mb-[12px] h-[68px]">
          <div className="mb-[8px] flex items-center gap-[10px]">
            <span
              className={[
                "inline-block px-[12px] py-[3px] text-[11px] font-bold uppercase tracking-[1.5px]",
                getTagColor(card.tag),
              ].join(" ")}
            >
              {card.tag}
            </span>
            {formatDate(card.publishTime || card.date) && (
              <span className="flex items-center gap-[4px] text-[13px] font-light text-[#999]">
                <img src="/images/icon-date.png" alt="Date" className="h-[24px] w-[24px] object-contain" />
                {formatDate(card.publishTime || card.date)}
              </span>
            )}
          </div>
          <h4
            className="text-[18px] leading-[1.4] text-[#2d2722]"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {card.title}
          </h4>
        </div>
        {/* Content section: fixed height */}
        <div className="mb-[16px] h-[44px]">
          <p
            className="text-[14px] font-light leading-[1.6] text-[#86909C]"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {card.summary}
          </p>
        </div>
        {/* Footer section: fixed height */}
        <div className="mt-auto h-[22px]">
          <Link
            href={`/news/${card.id}`}
            className="inline-flex items-center gap-[6px] text-[14px] font-bold text-[#2d2722] transition-colors hover:text-[#FF8C2E]"
          >
            {t("readMore")} <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers (migrated from the legacy view)
// ---------------------------------------------------------------------------

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(dateStr?: string): string {
  const d = parseDate(dateStr);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function getTagColor(type?: string): string {
  const map: Record<string, string> = {
    featured: "bg-[#FF8C2E] text-white",
    press: "bg-[#85714D]/10 text-[#85714D]",
    news: "bg-[#FF8C2E] text-white",
    event: "bg-[#8B7355] text-white",
  };
  const tag = (type || "news").toLowerCase();
  return map[tag] || "bg-[#FF8C2E] text-white";
}
