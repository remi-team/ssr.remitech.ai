"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { IMAGES } from "./images";

/**
 * HeroCarousel — migrated from the legacy Vue `index.vue` hero section.
 *
 * Features preserved:
 *  • Full-viewport Ken Burns carousel (4 slides, 8 distinct effects).
 *  • Responsive <picture> sources (1536 / 1280 / 768 breakpoints, webp + jpg).
 *  • Slide counter + progress bar (click-to-seek) + prev/next arrows.
 *  • Hover-pause, viewport-visibility-pause (IntersectionObserver), touch swipe.
 *  • Click-to-toggle-pause, arrow-key + spacebar navigation.
 *  • Ken Burns animation reset on slide change.
 *
 * Fallback strategy (per the migration brief):
 *  • The current grid-background design is kept as the **banner-image fallback**.
 *    It renders behind the slides; if a slide image fails to load (or the file
 *    is not yet in /public/images/), the grid + gradient + orange glow remains
 *    visible. Dropping the matching banner files into `public/images/` later
 *    activates them with zero code changes.
 *  • A `scroll-down` cue is preserved at the bottom (matching the existing
 *    hero's `ChevronDown` bounce).
 */

type SlideEffect =
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "pan-down"
  | "rotate-focus"
  | "diagonal";

interface HeroSlide {
  image768?: string;
  image1280?: string;
  image1536?: string;
  tag: string;
  effect: SlideEffect;
}

/** Slide data — canonical `/images/*` paths (resolve when files land in /public/images/). */
const heroSlides: HeroSlide[] = [
  { ...IMAGES.hero.slide1, tag: "COMPLIANCE FIRST", effect: "pan-up" },
  { ...IMAGES.hero.slide2, tag: "COMPLIANCE FIRST", effect: "pan-down" },
  { ...IMAGES.hero.slide3, tag: "COMPLIANCE FIRST", effect: "diagonal" },
  { ...IMAGES.hero.slide4, tag: "CROSS-BORDER PAYMENT", effect: "zoom-out" },
];

const CAROUSEL_DURATION = 8000; // ms per slide

export function HeroCarousel() {
  const t = useTranslations("Hero");
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Refs for the rAF loop (kept outside React state to avoid re-renders).
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef(0);
  const pausedRef = React.useRef(false);
  const visibleRef = React.useRef(true);
  const transitioningRef = React.useRef(false);
  const activeRef = React.useRef(0);
  const touchStartX = React.useRef(0);

  // Keep activeRef in sync.
  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // --------------------------------------------------------------------
  // Progress animation loop (rAF). Advances the progress bar and auto-
  // advances slides. Pauses on hover / out-of-viewport / manual pause.
  // --------------------------------------------------------------------
  const animateRef = React.useRef<() => void>(() => {});
  React.useEffect(() => {
    animateRef.current = () => {
      const elapsed = performance.now() - startRef.current;
      const pct = Math.min(elapsed / CAROUSEL_DURATION, 1);
      setProgress(pct * 100);
      if (pct < 1) {
        rafRef.current = requestAnimationFrame(animateRef.current);
      } else {
        // Advance to next slide.
        setActive((prev) => (prev + 1) % heroSlides.length);
      }
    };
  }, []);

  const resetProgress = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProgress(0);
    if (!pausedRef.current && visibleRef.current) {
      startRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animateRef.current);
    }
  }, []);

  // Reset progress whenever the active slide changes.
  React.useEffect(() => {
    resetProgress();
  }, [active, resetProgress]);

  // --------------------------------------------------------------------
  // Navigation helpers.
  // --------------------------------------------------------------------
  const goTo = React.useCallback(
    (index: number) => {
      if (transitioningRef.current || index === activeRef.current) return;
      transitioningRef.current = true;
      setActive(index);
      // Reset Ken Burns animation on the new slide's <img>.
      const slides = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-slide");
      const newEl = slides?.[index]?.querySelector("img");
      if (newEl) {
        newEl.style.animation = "none";
        // Force reflow.
        void newEl.offsetWidth;
        newEl.style.animation = "";
      }
      setTimeout(() => {
        transitioningRef.current = false;
      }, 700);
    },
    [],
  );

  const next = React.useCallback(() => goTo((activeRef.current + 1) % heroSlides.length), [goTo]);
  const prev = React.useCallback(
    () => goTo((activeRef.current - 1 + heroSlides.length) % heroSlides.length),
    [goTo],
  );

  // --------------------------------------------------------------------
  // Hover pause / resume.
  // --------------------------------------------------------------------
  const onHover = React.useCallback(
    (hovering: boolean) => {
      if (hovering) {
        if (!pausedRef.current && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (!pausedRef.current && visibleRef.current) {
        // Resume from current progress.
        startRef.current = performance.now() - (progress / 100) * CAROUSEL_DURATION;
        rafRef.current = requestAnimationFrame(animateRef.current);
      }
    },
    [progress],
  );

  const togglePause = React.useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    if (pausedRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      startRef.current = performance.now() - (progress / 100) * CAROUSEL_DURATION;
      rafRef.current = requestAnimationFrame(animateRef.current);
    }
  }, [progress]);

  // --------------------------------------------------------------------
  // Click on the carousel area (not on controls) toggles pause.
  // --------------------------------------------------------------------
  const onCarouselClick = React.useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".hero-arrow, .hero-progress-bar, .hero-slide-cta")) return;
      togglePause();
    },
    [togglePause],
  );

  // --------------------------------------------------------------------
  // Progress-bar click → seek to slide.
  // --------------------------------------------------------------------
  const onProgressClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      const targetIndex = Math.round(ratio * (heroSlides.length - 1));
      goTo(Math.max(0, Math.min(heroSlides.length - 1, targetIndex)));
    },
    [goTo],
  );

  // --------------------------------------------------------------------
  // Keyboard navigation.
  // --------------------------------------------------------------------
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prev();
          break;
        case "ArrowRight":
          next();
          break;
        case " ":
          e.preventDefault();
          togglePause();
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [prev, next, togglePause]);

  // --------------------------------------------------------------------
  // Touch swipe.
  // --------------------------------------------------------------------
  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);
  const onTouchEnd = React.useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) next();
        else prev();
      }
    },
    [next, prev],
  );

  // --------------------------------------------------------------------
  // IntersectionObserver — pause when scrolled out of view.
  // --------------------------------------------------------------------
  React.useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        } else if (!pausedRef.current) {
          startRef.current = performance.now() - (progress / 100) * CAROUSEL_DURATION;
          rafRef.current = requestAnimationFrame(animateRef.current);
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [progress]);

  // Cleanup on unmount.
  React.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="hero-carousel relative h-screen w-full cursor-pointer overflow-hidden bg-[#0a0a0a] text-white"
      onClick={onCarouselClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Grid background fallback — always rendered behind the slides.      */}
      {/* If slide images are absent / fail to load, this remains visible.   */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6900]/20 blur-[120px]"
        aria-hidden="true"
      />

      {/* ----------------------------------------------------------------- */}
      {/* Slides (Ken Burns)                                                 */}
      {/* ----------------------------------------------------------------- */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={cn("hero-slide", index === active && "active")}
          aria-hidden={index !== active}
        >
          <div className={cn("hero-effect", `effect-${slide.effect}`)}>
            <div className="hero-slide-image-wrap">
              {slide.image768 ? (
                <picture>
                  {slide.image1536 && (
                    <>
                      <source
                        media="(min-width:1536px)"
                        srcSet={`${slide.image1536}@1x_compressed.webp 1x, ${slide.image1536}@2x_compressed.webp 2x`}
                        type="image/webp"
                      />
                      <source
                        media="(min-width:1536px)"
                        srcSet={`${slide.image1536}@1x_compressed.jpg 1x, ${slide.image1536}@2x_compressed.jpg 2x`}
                        type="image/jpeg"
                      />
                    </>
                  )}
                  {slide.image1280 && (
                    <>
                      <source
                        media="(min-width:1280px)"
                        srcSet={`${slide.image1280}@1x_compressed.webp 1x, ${slide.image1280}@2x_compressed.webp 2x`}
                        type="image/webp"
                      />
                      <source
                        media="(min-width:1280px)"
                        srcSet={`${slide.image1280}@1x_compressed.jpg 1x, ${slide.image1280}@2x_compressed.jpg 2x`}
                        type="image/jpeg"
                      />
                    </>
                  )}
                  <source
                    srcSet={`${slide.image768}@1x_compressed.webp 1x, ${slide.image768}@2x_compressed.webp 2x`}
                    type="image/webp"
                  />
                  <img
                    src={`${slide.image768}@1x_compressed.jpg`}
                    srcSet={`${slide.image768}@1x_compressed.jpg 1x, ${slide.image768}@2x_compressed.jpg 2x`}
                    alt={slide.tag}
                    loading={index < 2 ? "eager" : "lazy"}
                    onError={(e) => {
                      // Image not yet in /public/images/ — hide it so the
                      // grid-background fallback shows cleanly. The picture
                      // element becomes transparent; no broken-image icon.
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                </picture>
              ) : null}
            </div>
          </div>
        </div>
      ))}

      {/* Bottom gradient for legibility */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.00) 32.97%, rgba(0,0,0,0.25) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ----------------------------------------------------------------- */}
      {/* Slide content (title + subtitle + quote + CTA)                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="hero-slide-content absolute inset-0 z-10 mx-auto flex max-w-[1536px] flex-col items-start justify-center px-8">
        <div className="hero-slide-text max-w-[1280px]">
          <h1
            id="hero-title"
            className="pb-4 text-[36px] font-bold text-white md:text-[56px]"
            style={{ textShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
          >
            {t("title")}
          </h1>
          <h4
            className="mb-10 pb-10 text-[24px] font-light text-[#F2F3F5] md:text-[36px]"
            style={{ textShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
          >
            {t("subtitle")}
          </h4>
          <p
            className="text-[16px] font-light text-[#F2F3F5] md:text-[24px]"
            style={{ textShadow: "0 4px 4px rgba(0,0,0,0.25)" }}
          >
            &ldquo;The network where every participant becomes more powerful<br className="hidden md:flex" /> from each other — compounding in<br className="hidden md:flex" /> strength as we grow&rdquo;
          </p>
        </div>
        <a
          href="/contact"
          className="hero-slide-cta mt-8 inline-flex items-center rounded bg-[#FF6B00] px-9 py-3.5 text-[16px] font-semibold tracking-wide text-[#FFF0E5] transition-colors hover:bg-[#e55a2b]"
          onClick={(e) => e.stopPropagation()}
        >
          {t("secondaryCta")}
        </a>
        <p className="hero-slide-bottom-quote absolute bottom-[90px] left-8 right-8 text-[16px] font-light text-white/80 md:text-[18px]">
          {t("quote")}
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Top controls (counter + progress + arrows) — desktop only          */}
      {/* ----------------------------------------------------------------- */}
      <div className="hero-top-controls absolute left-0 right-0 top-0 z-20 hidden items-center justify-between px-10 pt-40 lg:flex">
        <div className="flex items-center gap-4">
          <div className="hero-slide-counter flex items-baseline">
            <span className="current text-[1.25rem] font-bold text-white">
              {active + 1}
            </span>
            <span className="separator mx-1 text-[1rem] text-white/30">/</span>
            <span className="total text-[1rem] text-white/50">
              {heroSlides.length}
            </span>
          </div>
          <div
            className="hero-progress-bar h-0.5 w-[180px] cursor-pointer overflow-hidden rounded bg-white/15"
            onClick={onProgressClick}
          >
            <div
              className="hero-progress-fill h-full rounded bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="hero-arrow flex h-11 w-11 items-center justify-center rounded border border-white/10 bg-[#1a1a1a] text-white transition-colors hover:bg-[#ff6900] hover:border-[#ff6900]"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="hero-arrow flex h-11 w-11 items-center justify-center rounded border border-white/10 bg-[#1a1a1a] text-white transition-colors hover:bg-[#ff6900] hover:border-[#ff6900]"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next slide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Scroll-down cue (preserved from the existing hero)                  */}
      {/* ----------------------------------------------------------------- */}
      <a
        href="/#solutions"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
        aria-label={t("scroll")}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{t("scroll")}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  );
}
